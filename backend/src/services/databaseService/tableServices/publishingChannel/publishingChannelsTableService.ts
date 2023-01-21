/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { Controller } from "tsoa";

import { TableService } from "../models";
import { UsersTableService } from "../users/usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "../utilities";
import { UnrenderablePublishingChannel } from "../../../../controllers/publishingChannel/models";
import { PSQLUpdateFieldAndValue } from "../utilities/models";
import { PublishingChannelFollowsTableService } from "./publishingChannelFollowsTableService";
import { PublishingChannelUserBansTableService } from "./moderation/publishingChannelUserBansTableService";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBPublishingChannel {
  publishing_channel_id: string;
  owner_user_id: string;
  name: string;
  description?: string;

  external_url_1: string;
  external_url_2: string;
  external_url_3: string;
  external_url_4: string;
  external_url_5: string;

  publishing_channel_rule_1: string;
  publishing_channel_rule_2: string;
  publishing_channel_rule_3: string;
  publishing_channel_rule_4: string;
  publishing_channel_rule_5: string;

  background_image_blob_file_key?: string;
  profile_picture_blob_file_key?: string;

  comma_separated_banned_words: string;
}

function convertDBPublishingChannelToUnrenderablePublishingChannel(
  dbPublishingChannel: DBPublishingChannel,
): UnrenderablePublishingChannel {
  const externalUrls: string[] = [];
  [
    dbPublishingChannel.external_url_1,
    dbPublishingChannel.external_url_2,
    dbPublishingChannel.external_url_3,
    dbPublishingChannel.external_url_4,
    dbPublishingChannel.external_url_5,
  ].forEach((externalUrl) => {
    if (!!externalUrl) {
      externalUrls.push(externalUrl);
    }
  });
  const publishingChannelRules: string[] = [];
  [
    dbPublishingChannel.publishing_channel_rule_1,
    dbPublishingChannel.publishing_channel_rule_2,
    dbPublishingChannel.publishing_channel_rule_3,
    dbPublishingChannel.publishing_channel_rule_4,
    dbPublishingChannel.publishing_channel_rule_5,
  ].forEach((publishingChannelRule) => {
    if (!!publishingChannelRule) {
      publishingChannelRules.push(publishingChannelRule);
    }
  });

  return {
    publishingChannelId: dbPublishingChannel.publishing_channel_id,
    ownerUserId: dbPublishingChannel.owner_user_id,
    name: dbPublishingChannel.name,
    description: dbPublishingChannel.description,
    backgroundImageBlobFileKey: dbPublishingChannel.background_image_blob_file_key,
    profilePictureBlobFileKey: dbPublishingChannel.profile_picture_blob_file_key,
    publishingChannelRules,
    externalUrls,
    bannedWords: dbPublishingChannel.comma_separated_banned_words?.split(","),
  };
}

export class PublishingChannelsTableService extends TableService {
  public static readonly tableName = `publishing_channels`;
  public readonly tableName = PublishingChannelsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        publishing_channel_id VARCHAR(64) NOT NULL,
        owner_user_id VARCHAR(64) NOT NULL,
        name VARCHAR(64) UNIQUE NOT NULL,
        description VARCHAR(64),

        external_url_1 VARCHAR(64),
        external_url_2 VARCHAR(64),
        external_url_3 VARCHAR(64),
        external_url_4 VARCHAR(64),
        external_url_5 VARCHAR(64),
        publishing_channel_rule_1 VARCHAR(64),
        publishing_channel_rule_2 VARCHAR(64),
        publishing_channel_rule_3 VARCHAR(64),
        publishing_channel_rule_4 VARCHAR(64),
        publishing_channel_rule_5 VARCHAR(64),
        
        comma_separated_banned_words VARCHAR(256),

        background_image_blob_file_key VARCHAR(64) UNIQUE,
        profile_picture_blob_file_key VARCHAR(64) UNIQUE,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (publishing_channel_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (owner_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishingChannel({
    controller,
    publishingChannelId,
    ownerUserId,
    name,
    description,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
    externalUrls,
    publishingChannelRules,
    commaSeparatedBannedWords,
  }: {
    controller: Controller;
    publishingChannelId: string;
    ownerUserId: string;
    name: string;
    description?: string;
    backgroundImageBlobFileKey?: string;
    profilePictureBlobFileKey?: string;
    externalUrls: string[];
    publishingChannelRules: string[];
    commaSeparatedBannedWords: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    const [externalUrl1, externalUrl2, externalUrl3, externalUrl4, externalUrl5] =
      externalUrls;
    const [
      publishingChannelRule1,
      publishingChannelRule2,
      publishingChannelRule3,
      publishingChannelRule4,
      publishingChannelRule5,
    ] = publishingChannelRules;

    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "publishing_channel_id", value: publishingChannelId },
            { field: "owner_user_id", value: ownerUserId },
            { field: "name", value: name },
            { field: "description", value: description },
            {
              field: "background_image_blob_file_key",
              value: backgroundImageBlobFileKey,
            },
            { field: "profile_picture_blob_file_key", value: profilePictureBlobFileKey },

            { field: "external_url_1", value: externalUrl1 },
            { field: "external_url_2", value: externalUrl2 },
            { field: "external_url_3", value: externalUrl3 },
            { field: "external_url_4", value: externalUrl4 },
            { field: "external_url_5", value: externalUrl5 },
            { field: "publishing_channel_rule_1", value: publishingChannelRule1 },
            { field: "publishing_channel_rule_2", value: publishingChannelRule2 },
            { field: "publishing_channel_rule_3", value: publishingChannelRule3 },
            { field: "publishing_channel_rule_4", value: publishingChannelRule4 },
            { field: "publishing_channel_rule_5", value: publishingChannelRule5 },

            { field: "comma_separated_banned_words", value: commaSeparatedBannedWords },
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
          "Error at PublishingChannelsTableService.createPublishingChannel",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getMaybePublishingChannelByName({
    controller,
    name,
  }: {
    controller: Controller;
    name: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      UnrenderablePublishingChannel | null
    >
  > {
    try {
      const values = [name];

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            name = $1
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(
          convertDBPublishingChannelToUnrenderablePublishingChannel(rows[0]),
        );
      } else {
        return Success(null);
      }
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.selectPublishingChannelByName",
      });
    }
  }

  public async getPublishingChannelById({
    controller,
    publishingChannelId,
  }: {
    controller: Controller;
    publishingChannelId: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      UnrenderablePublishingChannel | null
    >
  > {
    try {
      const values = [publishingChannelId];

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_id = $1
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(
          convertDBPublishingChannelToUnrenderablePublishingChannel(rows[0]),
        );
      } else {
        return Success(null);
      }
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemsTableService.selectPublishingChannelById",
      });
    }
  }

  public async selectPublishingChannelsBySearchString({
    controller,
    searchString,
  }: {
    controller: Controller;
    searchString: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishingChannel[]>
  > {
    try {
      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            name LIKE CONCAT('%', $1::text, '%') OR
            description LIKE CONCAT('%', $1::text, '%')
          ;
        `,
        values: [searchString],
      };

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishingChannelToUnrenderablePublishingChannel),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.selectPublishingChannelsBySearchString",
      });
    }
  }

  public async determineWhichBlobFileKeysExist({
    controller,
    blobFileKeys,
  }: {
    controller: Controller;
    blobFileKeys: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const values: (string | number)[] = [];

      let backgroundBlobFileKeysCondition = "";
      backgroundBlobFileKeysCondition += `OR background_image_blob_file_key IN  ( `;

      const backgroundExecutorIdParameterStrings: string[] = [];
      blobFileKeys.forEach((blobFileKey) => {
        backgroundExecutorIdParameterStrings.push(`$${values.length + 1}`);
        values.push(blobFileKey);
      });
      backgroundBlobFileKeysCondition += backgroundExecutorIdParameterStrings.join(", ");
      backgroundBlobFileKeysCondition += ` )`;

      let profilePictureBlobFileKeysCondition = "";
      profilePictureBlobFileKeysCondition += `OR profile_picture_blob_file_key IN  ( `;

      const profilePictureExecutorIdParameterStrings: string[] = [];
      blobFileKeys.forEach((blobFileKey) => {
        profilePictureExecutorIdParameterStrings.push(`$${values.length + 1}`);
        values.push(blobFileKey);
      });
      profilePictureBlobFileKeysCondition +=
        profilePictureExecutorIdParameterStrings.join(", ");
      profilePictureBlobFileKeysCondition += ` )`;

      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            FALSE
            ${backgroundBlobFileKeysCondition}
            ${profilePictureBlobFileKeysCondition}
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        queryString,
      );

      const existingBackgroundBlobFileKeys = response.rows.map(
        (row) => row.background_image_blob_file_key,
      );
      const existingProfilePictureBlobFileKeys = response.rows.map(
        (row) => row.profile_picture_blob_file_key,
      );

      const existingBlobFileKeys = Array.from(
        existingBackgroundBlobFileKeys.concat(existingProfilePictureBlobFileKeys),
      ).filter((maybeBlobFileKey) => !!maybeBlobFileKey) as string[];

      return Success(existingBlobFileKeys);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.determineWhichBlobFileKeysExist",
      });
    }
  }

  public async getMostPopularPublishingChannelsUnfollowedByTargetUser({
    controller,
    targetUserId,
    pageSize,
    offset,
  }: {
    controller: Controller;
    targetUserId: string;
    pageSize: number;
    offset?: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishingChannel[]>
  > {
    try {
      const queryValues: Array<string | number> = [];

      // $1
      queryValues.push(targetUserId);

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

      const query: QueryConfig = {
        text: `
          SELECT
            ${PublishingChannelsTableService.tableName}.*
          FROM
            ${PublishingChannelsTableService.tableName}
            WHERE
            ${PublishingChannelsTableService.tableName}.publishing_channel_id IN (
              SELECT
                ${PublishingChannelsTableService.tableName}.publishing_channel_id
              FROM
                ${PublishingChannelsTableService.tableName}
              LEFT JOIN
                  ${PublishingChannelFollowsTableService.tableName}
                ON
                  ${PublishingChannelsTableService.tableName}.publishing_channel_id = ${PublishingChannelFollowsTableService.tableName}.publishing_channel_id_being_followed
              WHERE
                  ${PublishingChannelsTableService.tableName}.owner_user_id != $1
                AND
                  ${PublishingChannelsTableService.tableName}.publishing_channel_id NOT IN (
                        --------------------------------------------------
                        -- Filter Publishing Channels Already Followed By Target User
                        --------------------------------------------------
                    SELECT
                      ${PublishingChannelFollowsTableService.tableName}.publishing_channel_id_being_followed
                    FROM
                      ${PublishingChannelFollowsTableService.tableName}
                    WHERE
                      ${PublishingChannelFollowsTableService.tableName}.user_id_doing_following = $1
                  )
                AND ${PublishingChannelsTableService.tableName}.publishing_channel_id NOT IN (
                        --------------------------------------------------
                        -- Filter Publishing Channels Banning Target User
                        --------------------------------------------------
                    SELECT
                      ${PublishingChannelUserBansTableService.tableName}.publishing_channel_id
                    FROM
                      ${PublishingChannelUserBansTableService.tableName}
                    WHERE
                      ${PublishingChannelUserBansTableService.tableName}.banned_user_id = $1	
                )
              GROUP BY
                ${PublishingChannelsTableService.tableName}.publishing_channel_id
              ORDER BY
                COUNT(${PublishingChannelFollowsTableService.tableName}.publishing_channel_id_being_followed)
                DESC
              ${limitClause}
              ${offsetClause}
            )
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map(convertDBPublishingChannelToUnrenderablePublishingChannel),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.getMostPopularPublishingChannelsUnfollowedByTargetUser",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePublishingChannel({
    controller,

    publishingChannelId,
    name,
    description,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
    updatedExternalUrls,
    updatedPublishingChannelRules,
    updatedCommaSeparatedBannedWords,
  }: {
    controller: Controller;

    publishingChannelId: string;
    name?: string;
    description?: string;

    backgroundImageBlobFileKey?: string;
    profilePictureBlobFileKey?: string;
    updatedExternalUrls?: string[];
    updatedPublishingChannelRules?: string[];
    updatedCommaSeparatedBannedWords?: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishingChannel>
  > {
    let updatedExternalUrlFields: PSQLUpdateFieldAndValue<string | number>[];
    if (!!updatedExternalUrls) {
      const [externalUrl1, externalUrl2, externalUrl3, externalUrl4, externalUrl5] =
        updatedExternalUrls;

      updatedExternalUrlFields = [
        {
          field: "external_url_1",
          value: externalUrl1,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "external_url_2",
          value: externalUrl2,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "external_url_3",
          value: externalUrl3,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "external_url_4",
          value: externalUrl4,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "external_url_5",
          value: externalUrl5,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "comma_separated_banned_words",
          value: updatedCommaSeparatedBannedWords,
          settings: { includeWheneverNotUndefined: true },
        },
      ];
    } else {
      updatedExternalUrlFields = [];
    }

    let updatedPublishingChannelRuleFields: PSQLUpdateFieldAndValue<string | number>[];
    if (!!updatedPublishingChannelRules) {
      const [
        publishingChannelRule1,
        publishingChannelRule2,
        publishingChannelRule3,
        publishingChannelRule4,
        publishingChannelRule5,
      ] = updatedPublishingChannelRules;

      updatedPublishingChannelRuleFields = [
        {
          field: "publishing_channel_rule_1",
          value: publishingChannelRule1,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "publishing_channel_rule_2",
          value: publishingChannelRule2,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "publishing_channel_rule_3",
          value: publishingChannelRule3,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "publishing_channel_rule_4",
          value: publishingChannelRule4,
          settings: { includeWheneverNotUndefined: true },
        },
        {
          field: "publishing_channel_rule_5",
          value: publishingChannelRule5,
          settings: { includeWheneverNotUndefined: true },
        },
      ];
    } else {
      updatedPublishingChannelRuleFields = [];
    }

    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "name", value: name },
          {
            field: "description",
            value: description,
            settings: { includeWheneverNotUndefined: true },
          },
          { field: "background_image_blob_file_key", value: backgroundImageBlobFileKey },
          { field: "profile_picture_blob_file_key", value: profilePictureBlobFileKey },
          ...updatedExternalUrlFields,
          ...updatedPublishingChannelRuleFields,
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "publishing_channel_id",
            value: publishingChannelId,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(
          convertDBPublishingChannelToUnrenderablePublishingChannel(rows[0]),
        );
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation:
          "Error at PublishingChannelsTableService.updatePublishingChannel",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelsTableService.updatePublishingChannel",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishingChannel({
    controller,
    publishingChannelId,
    userId,
  }: {
    controller: Controller;
    publishingChannelId: string;
    userId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishingChannel>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "publishing_channel_id", value: publishingChannelId },
          { field: "owner_user_id", value: userId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannel> = await this.datastorePool.query(
        query,
      );

      const rows = response.rows;

      if (!!rows.length) {
        const row = response.rows[0];
        return Success(convertDBPublishingChannelToUnrenderablePublishingChannel(row));
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error:
          "Publishing Channel not found at PublishingChannelsTableService.deletePublishingChannel",
        additionalErrorInformation:
          "Error at PublishingChannelsTableService.deletePublishingChannel",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelsTableService.deletePublishingChannel",
      });
    }
  }
}
