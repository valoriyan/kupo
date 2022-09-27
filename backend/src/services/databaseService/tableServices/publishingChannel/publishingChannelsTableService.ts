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
import { generatePSQLGenericUpdateRowQueryString } from "../utilities";
import { UnrenderablePublishingChannel } from "../../../../controllers/publishingChannel/models";
import { PSQLUpdateFieldAndValue } from "../utilities/models";

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
    publishingChannelRules,
    externalUrls,
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

  public async getPublishingChannelByName({
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
  }: {
    controller: Controller;

    publishingChannelId: string;
    name?: string;
    description?: string;

    backgroundImageBlobFileKey?: string;
    profilePictureBlobFileKey?: string;
    updatedExternalUrls?: string[];
    updatedPublishingChannelRules?: string[];
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
          settings: { includeIfEmpty: true },
        },
        {
          field: "external_url_2",
          value: externalUrl2,
          settings: { includeIfEmpty: true },
        },
        {
          field: "external_url_3",
          value: externalUrl3,
          settings: { includeIfEmpty: true },
        },
        {
          field: "external_url_4",
          value: externalUrl4,
          settings: { includeIfEmpty: true },
        },
        {
          field: "external_url_5",
          value: externalUrl5,
          settings: { includeIfEmpty: true },
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
          settings: { includeIfEmpty: true },
        },
        {
          field: "publishing_channel_rule_2",
          value: publishingChannelRule2,
          settings: { includeIfEmpty: true },
        },
        {
          field: "publishing_channel_rule_3",
          value: publishingChannelRule3,
          settings: { includeIfEmpty: true },
        },
        {
          field: "publishing_channel_rule_4",
          value: publishingChannelRule4,
          settings: { includeIfEmpty: true },
        },
        {
          field: "publishing_channel_rule_5",
          value: publishingChannelRule5,
          settings: { includeIfEmpty: true },
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
            settings: { includeIfEmpty: true },
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
}
