/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import { TableService } from "../models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "../utilities";
import { assertIsNumber } from "../utilities/validations";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import {
  PublishedItemType,
  UnassembledBasePublishedItem,
} from "../../../../controllers/publishedItem/models";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { UsersTableService } from "../users/usersTableService";
import { PublishingChannelSubmissionsTableService } from "../publishingChannel/publishingChannelSubmissionsTableService";
import { PublishingChannelFollowsTableService } from "../publishingChannel/publishingChannelFollowsTableService";
import { UserFollowsTableService } from "../users/userFollowsTableService";
import { PublishedItemLikesTableService } from "./publishedItemLikesTableService";
import { PublishingChannelsTableService } from "../publishingChannel/publishingChannelsTableService";

export enum PublishedItemHostSelector {
  user = "user",
  publishingChannel = "publishingChannel",
}

interface DBPublishedItem {
  type: PublishedItemType;
  id: string;
  author_user_id: string;
  caption: string;
  creation_timestamp: string;
  scheduled_publication_timestamp: string;
  expiration_timestamp?: string;
  id_of_published_item_being_shared?: string;
}

function convertDBPublishedItemToUncompiledBasePublishedItem(
  dbPublishedItem: DBPublishedItem,
): UnassembledBasePublishedItem {
  return {
    type: dbPublishedItem.type,
    id: dbPublishedItem.id,
    authorUserId: dbPublishedItem.author_user_id,
    caption: dbPublishedItem.caption,
    creationTimestamp: parseInt(dbPublishedItem.creation_timestamp),
    scheduledPublicationTimestamp: parseInt(
      dbPublishedItem.scheduled_publication_timestamp,
    ),
    expirationTimestamp: !!dbPublishedItem.expiration_timestamp
      ? parseInt(dbPublishedItem.expiration_timestamp)
      : undefined,
    idOfPublishedItemBeingShared: dbPublishedItem.id_of_published_item_being_shared,
  };
}

export class PublishedItemsTableService extends TableService {
  public static readonly tableName = `published_items`;
  public readonly tableName = PublishedItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        
        type VARCHAR(64) NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        caption VARCHAR(512) NOT NULL,
        creation_timestamp BIGINT NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL,
        expiration_timestamp BIGINT,
        id_of_published_item_being_shared VARCHAR(64),

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (author_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_shared_fkey
          FOREIGN KEY (id_of_published_item_being_shared)
          REFERENCES ${PublishedItemsTableService.tableName} (id)
          ON DELETE CASCADE
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishedItem({
    controller,
    type,
    publishedItemId,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
  }: {
    controller: Controller;
    type: PublishedItemType;
    publishedItemId: string;
    creationTimestamp: number;
    authorUserId: string;
    caption: string;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
    idOfPublishedItemBeingShared?: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "type", value: type },
            { field: "id", value: publishedItemId },
            { field: "author_user_id", value: authorUserId },
            { field: "caption", value: caption },
            { field: "creation_timestamp", value: creationTimestamp },
            {
              field: "scheduled_publication_timestamp",
              value: scheduledPublicationTimestamp,
            },
            { field: "expiration_timestamp", value: expirationTimestamp },
            {
              field: "id_of_published_item_being_shared",
              value: idOfPublishedItemBeingShared,
            },
          ],
        ],
        tableName: this.tableName,
      });

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.createPublishedItem",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async GET_ALL_PUBLISHED_ITEMS({
    controller,
    filterOutExpiredAndUnscheduledPublishedItems,
    limit,
    getPublishedItemsBeforeTimestamp,
    type,
  }: {
    controller: Controller;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    limit?: number;
    getPublishedItemsBeforeTimestamp?: number;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const queryValues: (string | number)[] = [];
      const currentTimestamp = Date.now();

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      let filteringWhereClause = "";
      if (!!filterOutExpiredAndUnscheduledPublishedItems) {
        filteringWhereClause = `
          AND
            (
              scheduled_publication_timestamp IS NULL
                OR
              scheduled_publication_timestamp < $${queryValues.length + 1}
            ) 
          AND
            (
                expiration_timestamp IS NULL
              OR
                expiration_timestamp > $${queryValues.length + 2}
            )
        `;

        queryValues.push(currentTimestamp);
        queryValues.push(currentTimestamp);
      }

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let getPublishedItemsBeforeTimestampClause = "";
      if (!!getPublishedItemsBeforeTimestamp) {
        getPublishedItemsBeforeTimestampClause = `
          AND
            scheduled_publication_timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(getPublishedItemsBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            true
            ${typeConstraintClause}
            ${filteringWhereClause}
            ${getPublishedItemsBeforeTimestampClause}
          ORDER BY
            scheduled_publication_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.GET_ALL_PUBLISHED_ITEMS",
      });
    }
  }

  public async getPublishedItemsByAuthorUserId({
    controller,
    authorUserId,
    filterOutExpiredAndUnscheduledPublishedItems,
    limit,
    getPublishedItemsBeforeTimestamp,
    publishedItemHost,
    type,
  }: {
    controller: Controller;
    authorUserId: string;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    limit?: number;
    getPublishedItemsBeforeTimestamp?: number;
    publishedItemHost: PublishedItemHostSelector;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const queryValues: (string | number)[] = [authorUserId];
      const currentTimestamp = Date.now();

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            ${PublishedItemsTableService.tableName}.type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      let filteringWhereClause = "";
      if (!!filterOutExpiredAndUnscheduledPublishedItems) {
        filteringWhereClause = `
          AND
            (
                ${
                  PublishedItemsTableService.tableName
                }.scheduled_publication_timestamp IS NULL
              OR
                ${
                  PublishedItemsTableService.tableName
                }.scheduled_publication_timestamp < $${queryValues.length + 1}
            ) 
          AND
            (
                ${PublishedItemsTableService.tableName}.expiration_timestamp IS NULL
              OR
                ${PublishedItemsTableService.tableName}.expiration_timestamp > $${
          queryValues.length + 2
        }
            )
        `;

        queryValues.push(currentTimestamp);
        queryValues.push(currentTimestamp);
      }

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let getPublishedItemsBeforeTimestampClause = "";
      if (!!getPublishedItemsBeforeTimestamp) {
        getPublishedItemsBeforeTimestampClause = `
          AND
            ${PublishedItemsTableService.tableName}.scheduled_publication_timestamp < $${
          queryValues.length + 1
        }
        `;

        queryValues.push(getPublishedItemsBeforeTimestamp);
      }

      let publishedItemHostClause = "";
      if (publishedItemHost == PublishedItemHostSelector.user) {
        publishedItemHostClause = `
          AND
            ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_submission_id IS NULL            
        `;
      } else if (publishedItemHostClause == PublishedItemHostSelector.publishingChannel) {
        publishedItemHostClause = `
          AND
            ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_submission_id IS NOT NULL            
        `;
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${PublishedItemsTableService.tableName}
          LEFT JOIN
            ${PublishingChannelSubmissionsTableService.tableName}
            ON
              ${PublishedItemsTableService.tableName}.id = ${PublishingChannelSubmissionsTableService.tableName}.published_item_id
          WHERE
            ${PublishedItemsTableService.tableName}.author_user_id = $1
            ${typeConstraintClause}
            ${filteringWhereClause}
            ${getPublishedItemsBeforeTimestampClause}
            ${publishedItemHostClause}
          ORDER BY
            scheduled_publication_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsByAuthorUserId",
      });
    }
  }

  public async getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId({
    controller,
    creatorUserId,
    rangeEndTimestamp,
    rangeStartTimestamp,
    type,
  }: {
    controller: Controller;
    creatorUserId: string;
    rangeEndTimestamp: number;
    rangeStartTimestamp: number;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      assertIsNumber(rangeEndTimestamp);
      assertIsNumber(rangeStartTimestamp);

      const queryValues: (string | number)[] = [
        creatorUserId,
        rangeStartTimestamp,
        rangeEndTimestamp,
      ];

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
              author_user_id = $1
            AND
              scheduled_publication_timestamp IS NOT NULL
            AND
              scheduled_publication_timestamp >= $2
            AND
              scheduled_publication_timestamp <= $3
            ${typeConstraintClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId",
      });
    }
  }

  public async getPublishedItemsByCreatorUserIds({
    controller,
    creatorUserIds,
    beforeTimestamp,
    pageSize,
    publishedItemHost,
    filterOutExpiredAndUnscheduledPublishedItems,
    type,
  }: {
    controller: Controller;
    creatorUserIds: string[];
    beforeTimestamp?: number;
    pageSize: number;
    publishedItemHost: PublishedItemHostSelector;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      if (creatorUserIds.length === 0) {
        return Success([]);
      }
      const currentTimestamp = Date.now();

      const queryValues: Array<string | number> = [...creatorUserIds, pageSize];

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            ${PublishedItemsTableService.tableName}.type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      let beforeTimestampCondition = "";
      if (!!beforeTimestamp) {
        beforeTimestampCondition = `
          AND
            ${PublishedItemsTableService.tableName}.scheduled_publication_timestamp < $${
          queryValues.length + 1
        }`;
        queryValues.push(beforeTimestamp);
      }

      const creatorUserIdsQueryString = creatorUserIds
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      let publishedItemHostClause = "";
      if (publishedItemHost == PublishedItemHostSelector.user) {
        publishedItemHostClause = `
          AND
            ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_submission_id IS NULL            
        `;
      } else if (publishedItemHostClause == PublishedItemHostSelector.publishingChannel) {
        publishedItemHostClause = `
          AND
            ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_submission_id IS NOT NULL            
        `;
      }

      let filteringWhereClause = "";
      if (!!filterOutExpiredAndUnscheduledPublishedItems) {
        filteringWhereClause = `
          AND
            (
              scheduled_publication_timestamp IS NULL
                OR
              scheduled_publication_timestamp < $${queryValues.length + 1}
            ) 
          AND
            (
                expiration_timestamp IS NULL
              OR
                expiration_timestamp > $${queryValues.length + 2}
            )
        `;

        queryValues.push(currentTimestamp);
        queryValues.push(currentTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${PublishedItemsTableService.tableName}
          LEFT JOIN
            ${PublishingChannelSubmissionsTableService.tableName}
            ON
              ${PublishedItemsTableService.tableName}.id = ${
          PublishingChannelSubmissionsTableService.tableName
        }.published_item_id
          WHERE
            ${
              PublishedItemsTableService.tableName
            }.author_user_id IN (${creatorUserIdsQueryString})
            ${typeConstraintClause}
            ${beforeTimestampCondition}
            ${publishedItemHostClause}
            ${filteringWhereClause}
          ORDER BY
            scheduled_publication_timestamp DESC
          LIMIT
            $${creatorUserIds.length + 1}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsByCreatorUserIds",
      });
    }
  }

  public async getPublishedItemsFromAllFollowings({
    controller,
    requestingUserId,
    beforeTimestamp,
    pageSize,
    filterOutExpiredAndUnscheduledPublishedItems,
    type,
  }: {
    controller: Controller;
    requestingUserId: string;
    beforeTimestamp?: number;
    pageSize: number;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const currentTimestamp = Date.now();

      const queryValues: Array<string | number> = [];
      queryValues.push(requestingUserId);

      const limitClause = `
        LIMIT
          $${queryValues.length + 1}
      `;
      queryValues.push(pageSize);

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            ${PublishedItemsTableService.tableName}.type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      let beforeTimestampCondition = "";
      if (!!beforeTimestamp) {
        beforeTimestampCondition = `
          AND
            ${PublishedItemsTableService.tableName}.scheduled_publication_timestamp < $${
          queryValues.length + 1
        }`;
        queryValues.push(beforeTimestamp);
      }

      let filteringWhereClause = "";
      if (!!filterOutExpiredAndUnscheduledPublishedItems) {
        filteringWhereClause = `
          AND
            (
              scheduled_publication_timestamp IS NULL
                OR
              scheduled_publication_timestamp < $${queryValues.length + 1}
            ) 
          AND
            (
                expiration_timestamp IS NULL
              OR
                expiration_timestamp > $${queryValues.length + 2}
            )
        `;

        queryValues.push(currentTimestamp);
        queryValues.push(currentTimestamp);
      }

      const query = {
        text: `
          SELECT
            DISTINCT ${PublishedItemsTableService.tableName}.*
          FROM
            ${PublishedItemsTableService.tableName}
          LEFT OUTER JOIN
              ${PublishingChannelSubmissionsTableService.tableName}
            ON
              ${PublishedItemsTableService.tableName}.id = ${PublishingChannelSubmissionsTableService.tableName}.published_item_id
          LEFT OUTER JOIN
              ${PublishingChannelFollowsTableService.tableName}
            ON
              ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id = ${PublishingChannelFollowsTableService.tableName}.publishing_channel_id_being_followed
          LEFT OUTER JOIN
              ${UserFollowsTableService.tableName}
            ON
              ${PublishedItemsTableService.tableName}.author_user_id = ${UserFollowsTableService.tableName}.user_id_being_followed
          WHERE
              TRUE
              ${typeConstraintClause}
              ${beforeTimestampCondition}
              ${filteringWhereClause}
            AND
              (
                  -------------------------------------------------------
                  -- Published Items From Followed Publishing Channels
                  -------------------------------------------------------
                  (
                      ${PublishingChannelFollowsTableService.tableName}.user_id_doing_following = $1
                    AND 
                      ${PublishingChannelSubmissionsTableService.tableName}.is_pending = FALSE
                    AND 
                      ${PublishingChannelFollowsTableService.tableName}.is_pending = FALSE      
                  )
                OR
                  -------------------------------------------------------
                  -- Published Items From Followed Users
                  -------------------------------------------------------
                  (
                      ${UserFollowsTableService.tableName}.user_id_doing_following = $1
                    AND
                      ${UserFollowsTableService.tableName}.is_pending = FALSE
                    AND
                      ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id IS NULL
                  )
                OR
                  -------------------------------------------------------
                  -- Published Items From Requestor
                  -------------------------------------------------------
                  (
                      ${PublishedItemsTableService.tableName}.author_user_id = $1
                    AND
                      (
                          publishing_channel_submissions.publishing_channel_id IS NULL
                        OR 
                          publishing_channel_submissions.is_pending = FALSE
                      )
                  )
              )
          ORDER BY
            scheduled_publication_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsFromAllFollowings",
      });
    }
  }

  public async getPublishedItemById({
    controller,
    id,
  }: {
    controller: Controller;
    id: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            id = $1
          ;
        `,
        values: [id],
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      if (response.rows.length < 1) {
        throw new Error(`Missing published item: ${id}`);
      }

      return Success(
        convertDBPublishedItemToUncompiledBasePublishedItem(response.rows[0]),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemById",
      });
    }
  }

  public async getPublishedItemsByIds({
    controller,
    ids,
    limit,
    getPublishedItemsBeforeTimestamp,
    restrictedToType,
  }: {
    controller: Controller;
    ids: string[];
    limit?: number;
    getPublishedItemsBeforeTimestamp?: number;
    restrictedToType?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const queryValues = ([] as string[]).concat(ids);

      if (ids.length === 0) {
        return Success([]);
      }

      const idsQueryString = `( ${ids.map((_, index) => `$${index + 1}`).join(", ")} )`;

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit.toString());
      }

      let getPublishedItemsBeforeTimestampClause = "";
      if (!!getPublishedItemsBeforeTimestamp) {
        getPublishedItemsBeforeTimestampClause = `
          AND
            scheduled_publication_timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(getPublishedItemsBeforeTimestamp.toString());
      }

      let typeConstraintClause = "";
      if (!!restrictedToType) {
        typeConstraintClause = `
          AND
            type = $${queryValues.length + 1}
        `;
        queryValues.push(restrictedToType);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            id IN ${idsQueryString}
            ${getPublishedItemsBeforeTimestampClause}
            ${typeConstraintClause}
          ORDER BY
            scheduled_publication_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsByIds",
      });
    }
  }

  public async getPublishedItemsByCaptionMatchingSubstring({
    controller,
    captionSubstring,
    filterOutExpiredAndUnscheduledPublishedItems,
    type,
  }: {
    controller: Controller;
    captionSubstring: string;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const queryValues: (string | number)[] = [captionSubstring];
      const currentTimestamp = Date.now();

      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      let filteringWhereClause = "";
      if (!!filterOutExpiredAndUnscheduledPublishedItems) {
        filteringWhereClause = `
          AND
            (
              scheduled_publication_timestamp IS NULL
                OR
              scheduled_publication_timestamp < $${queryValues.length + 1}
            ) 
          AND
            (
                expiration_timestamp IS NULL
              OR
                expiration_timestamp > $${queryValues.length + 2}
            )
        `;

        queryValues.push(currentTimestamp);
        queryValues.push(currentTimestamp);
      }

      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            caption LIKE CONCAT('%', $1::text, '%' )
            ${typeConstraintClause}
            ${filteringWhereClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      const rows = response.rows;

      return Success(rows.map(convertDBPublishedItemToUncompiledBasePublishedItem));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsByCaptionMatchingSubstring",
      });
    }
  }

  public async getMostPopularPublishedItemsUnlikedByTargetUser({
    controller,
    targetUserId,
    pageSize,
    offset,
    type,
  }: {
    controller: Controller;
    targetUserId: string;
    pageSize: number;
    offset?: number;
    type?: PublishedItemType;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnassembledBasePublishedItem[]>
  > {
    try {
      const queryValues: Array<string | number> = [];

      // $1
      queryValues.push(targetUserId);

      // $2
      const currentTimestamp = Date.now();
      queryValues.push(currentTimestamp);

      // Optional Type Constraint
      let typeConstraintClause = "";
      if (!!type) {
        typeConstraintClause = `
          AND
            ${PublishedItemsTableService.tableName}.type = $${queryValues.length + 1}
        `;
        queryValues.push(type);
      }

      const limitClause = `
        LIMIT
          $${queryValues.length + 1}
      `;
      queryValues.push(pageSize);

      let offsetClause = ``;
      if (!!offset) {
        offsetClause = `
          OFFSET
            $${queryValues.length + 1}
        `;
        queryValues.push(offset);
      }

      const query = {
        text: `
          SELECT
            ${PublishedItemsTableService.tableName}.*
          FROM
            ${PublishedItemsTableService.tableName}
          WHERE
            ${PublishedItemsTableService.tableName}.id IN(
              SELECT
                ${PublishedItemsTableService.tableName}.id
              FROM
                ${PublishedItemsTableService.tableName}
              LEFT JOIN
                  ${PublishedItemLikesTableService.tableName}
                ON
                  ${PublishedItemsTableService.tableName}.id = ${PublishedItemLikesTableService.tableName}.published_item_id
              LEFT JOIN
                  ${PublishingChannelSubmissionsTableService.tableName}
                ON
                  ${PublishedItemsTableService.tableName}.id = ${PublishingChannelSubmissionsTableService.tableName}.published_item_id
              LEFT JOIN
                  ${PublishingChannelFollowsTableService.tableName}
                ON
                  ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id = ${PublishingChannelFollowsTableService.tableName}.publishing_channel_id_being_followed
              LEFT JOIN
                  ${PublishingChannelsTableService.tableName}
                ON
                  ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id = ${PublishingChannelsTableService.tableName}.publishing_channel_id
              WHERE
                  ${PublishedItemsTableService.tableName}.author_user_id != $1
                AND
                  ${PublishedItemsTableService.tableName}.id NOT IN (
                    --------------------------------------------------
                    -- Published Items Already Liked By Target User
                    --------------------------------------------------
                    SELECT
                      ${PublishedItemLikesTableService.tableName}.published_item_id
                    FROM
                      ${PublishedItemLikesTableService.tableName}
                    WHERE
                      ${PublishedItemLikesTableService.tableName}.user_id = $1
                  )
                AND
                  --------------------------------------------------
                  -- Filter Out Not Yet Published Items
                  --------------------------------------------------
                    (
                        ${PublishedItemsTableService.tableName}.scheduled_publication_timestamp IS NULL
                      OR
                        ${PublishedItemsTableService.tableName}.scheduled_publication_timestamp < $2
                    )
                AND
                  --------------------------------------------------
                  -- Filter Out Expired Published Items
                  --------------------------------------------------
                  (
                      ${PublishedItemsTableService.tableName}.expiration_timestamp IS NULL
                    OR
                      ${PublishedItemsTableService.tableName}.expiration_timestamp > $2
                  )
                ${typeConstraintClause}
                AND
                  (
                      ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id IS NULL
                    OR
                      --------------------------------------------------
                      -- Filter Pending Publishing Channel Submissions
                      --------------------------------------------------	
                      (
                          ${PublishingChannelSubmissionsTableService.tableName}.is_pending = FALSE
                          --------------------------------------------------
                          -- TODO: ADD CHECK FOR PRIVATE PUBLISHING CHANNELS
                          --------------------------------------------------
                      )
                  )
              GROUP BY
                ${PublishedItemsTableService.tableName}.id
              ORDER BY
                COUNT(${PublishedItemLikesTableService.tableName}.published_item_id)
                DESC
              ${limitClause}
              ${offsetClause}
            )
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getMostPopularPublishedItemsUnlikedByTargetUser",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateContentItemById({
    controller,
    id,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    controller: Controller;
    id: string;
    authorUserId?: string;
    caption?: string;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "author_user_id", value: authorUserId },
          { field: "caption", value: caption },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expirationTimestamp", value: expirationTimestamp },
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "id",
            value: id,
          },
        ],
        tableName: this.tableName,
      });

      if (!isQueryEmpty({ query })) {
        await this.datastorePool.query(query);
      }
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.updateContentItemById",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishedItem({
    controller,
    id,
    authorUserId,
  }: {
    controller: Controller;
    id: string;
    authorUserId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "id", value: id },
          { field: "author_user_id", value: authorUserId },
        ],
        tableName: this.tableName,
      });

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.deletePublishedItem",
      });
    }
  }
}
