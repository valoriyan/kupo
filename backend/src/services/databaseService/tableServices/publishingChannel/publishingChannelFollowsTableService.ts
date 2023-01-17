/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { FollowingStatus } from "../../../../controllers/user/userInteraction/models";
import { TableService } from "../models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "../utilities";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { UsersTableService } from "../users/usersTableService";
import { PublishingChannelsTableService } from "./publishingChannelsTableService";

interface DBPublishingChannelFollow {
  publishing_channel_follow_event_id: string;
  user_id_doing_following: string;
  publishing_channel_id_being_followed: string;
  is_pending: boolean;
  timestamp: string;
}

export class PublishingChannelFollowsTableService extends TableService {
  public static readonly tableName = `publishing_channel_follows`;
  public readonly tableName = PublishingChannelFollowsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    UsersTableService.tableName,
    PublishingChannelsTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        publishing_channel_follow_event_id VARCHAR(64) NOT NULL,

        user_id_doing_following VARCHAR(64) NOT NULL,
        publishing_channel_id_being_followed VARCHAR(64) NOT NULL,
        is_pending boolean NOT NULL,
        timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (user_id_doing_following, publishing_channel_id_being_followed),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id_doing_following)
          REFERENCES ${UsersTableService.tableName} (user_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishingChannelsTableService.tableName}_fkey
          FOREIGN KEY (publishing_channel_id_being_followed)
          REFERENCES ${PublishingChannelsTableService.tableName} (publishing_channel_id)
          ON DELETE CASCADE

      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishingChannelFollow({
    controller,
    userIdDoingFollowing,
    publishingChannelIdBeingFollowed,
    publishingChannelFollowEventId,
    isPending,
    timestamp,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    publishingChannelIdBeingFollowed: string;
    publishingChannelFollowEventId: string;
    isPending: boolean;
    timestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const is_pending_value = !!isPending ? "true" : "false";

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_id_doing_following", value: userIdDoingFollowing },
            {
              field: "publishing_channel_id_being_followed",
              value: publishingChannelIdBeingFollowed,
            },
            {
              field: "publishing_channel_follow_event_id",
              value: publishingChannelFollowEventId,
            },
            { field: "is_pending", value: is_pending_value },
            { field: "timestamp", value: timestamp },
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
          "Error at PublishingChannelFollowsTableService.createPublishingChannelFollow",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishingChannelFollowEventById({
    controller,
    publishingChannelFollowEventId,
  }: {
    controller: Controller;
    publishingChannelFollowEventId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_follow_event_id = $1
          ;
        `,
        values: [publishingChannelFollowEventId],
      };

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.getPublishingChannelFollowEventById",
      });
    }
  }

  public async getUserIdsFollowingPublishingChannelId({
    controller,
    publishingChannelIdBeingFollowed,
    areFollowsPending,
    limit,
    createdBeforeTimestamp,
  }: {
    controller: Controller;
    publishingChannelIdBeingFollowed: string;
    areFollowsPending: boolean;
    limit?: number;
    createdBeforeTimestamp?: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow[]>
  > {
    try {
      const queryValues: (string | number)[] = [publishingChannelIdBeingFollowed];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let beforeTimestampClause = "";
      if (!!createdBeforeTimestamp) {
        beforeTimestampClause = `
          AND
            timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(createdBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_id_being_followed = $1
            ${pendingConstraintClause}
            ${beforeTimestampClause}
          ${limitClause}

          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.getUserIdsFollowingPublishingChannelId",
      });
    }
  }

  public async getPublishingChannelFollowsByUserId({
    controller,
    userIdDoingFollowing,
    areFollowsPending,
    limit,
    createdBeforeTimestamp,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    areFollowsPending: boolean;
    limit?: number;
    createdBeforeTimestamp?: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow[]>
  > {
    try {
      const queryValues: (string | number)[] = [userIdDoingFollowing];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let beforeTimestampClause = "";
      if (!!createdBeforeTimestamp) {
        beforeTimestampClause = `
          AND
            timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(createdBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
            ${pendingConstraintClause}
            ${beforeTimestampClause}
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.getPublishingChannelIdsFollowedByUserId",
      });
    }
  }

  public async countFollowersOfPublishingChannelId({
    controller,
    publishingChannelIdBeingFollowed,
    areFollowsPending,
  }: {
    controller: Controller;
    publishingChannelIdBeingFollowed: string;
    areFollowsPending: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const queryValues: (string | number)[] = [publishingChannelIdBeingFollowed];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_id_being_followed = $1
            ${pendingConstraintClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.countFollowersOfPublishingChannelId",
      });
    }
  }

  public async countPublishingChannelFollowsOfUserId({
    controller,
    userIdDoingFollowing,
    areFollowsPending,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    areFollowsPending: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const queryValues: (string | number)[] = [userIdDoingFollowing];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
            ${pendingConstraintClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      if (response.rows.length === 0) {
        throw new Error("Missing follow event");
      }

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.countPublishingChannelFollowsOfUserId",
      });
    }
  }

  public async getFollowingStatusOfUserIdToPublishingChannelId({
    controller,
    userIdDoingFollowing,
    publishingChannelIdBeingFollowed,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    publishingChannelIdBeingFollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, FollowingStatus>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
          AND
            publishing_channel_id_being_followed = $2
          LIMIT
            1
          ;
        `,
        values: [userIdDoingFollowing, publishingChannelIdBeingFollowed],
      };

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);

      if (response.rows.length === 0) {
        return Success(FollowingStatus.not_following);
      }

      const userFollow = response.rows[0];
      if (userFollow.is_pending) {
        return Success(FollowingStatus.pending);
      }

      return Success(FollowingStatus.is_following);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.getFollowingStatusOfUserIdToPublishingChannelId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////
  public async approvePendingPublishingChannelFollow({
    controller,
    userIdDoingFollowing,
    publishingChannelIdBeingFollowed,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    publishingChannelIdBeingFollowed: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "is_pending", value: "false" }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id_doing_following",
            value: userIdDoingFollowing,
          },
          {
            field: "publishing_channel_id_being_followed",
            value: publishingChannelIdBeingFollowed,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(rows[0]);
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.approvePendingPublishingChannelFollow",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.approvePendingPublishingChannelFollow",
      });
    }
  }

  public async approveAllPendingPublishingChannelFollows({
    controller,
    publishingChannelIdBeingFollowed,
  }: {
    controller: Controller;
    publishingChannelIdBeingFollowed: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow[]>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "is_pending", value: "false" }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "publishing_channel_id_being_followed",
            value: publishingChannelIdBeingFollowed,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannelFollow> =
        await this.datastorePool.query(query);

      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.approveAllPendingPublishingChannelFollows",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishingChannelFollow({
    controller,
    userIdDoingUnfollowing,
    publishingChannelIdBeingUnfollowed,
  }: {
    controller: Controller;
    userIdDoingUnfollowing: string;
    publishingChannelIdBeingUnfollowed: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "user_id_doing_following", value: userIdDoingUnfollowing },
          {
            field: "publishing_channel_id_being_followed",
            value: publishingChannelIdBeingUnfollowed,
          },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelFollow>(query);
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.deletePublishingChannelFollow",
      });
    }
  }

  public async deleteAllPendingPublishingChannelFollows({
    controller,
    publishingChannelIdBeingUnfollowed,
  }: {
    controller: Controller;
    publishingChannelIdBeingUnfollowed: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelFollow>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "is_pending", value: "true" },
          {
            field: "publishing_channel_id_being_followed",
            value: publishingChannelIdBeingUnfollowed,
          },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelFollow>(query);
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelFollowsTableService.deleteAllPendingPublishingChannelFollows",
      });
    }
  }
}
