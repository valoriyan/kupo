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
import { UsersTableService } from "../usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { generatePSQLGenericUpdateRowQueryString } from "../utilities";
import { UnrenderablePublishingChannel } from "../../../../controllers/publishingChannel/models";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBPublishingChannel {
  publishing_channel_id: string;
  owner_user_id: string;
  name: string;
  description: string;
}

function convertDBPublishingChannelToUnrenderablePublishingChannel(
  dbPublishingChannel: DBPublishingChannel,
): UnrenderablePublishingChannel {
  return {
    publishingChannelId: dbPublishingChannel.publishing_channel_id,
    ownerUserId: dbPublishingChannel.owner_user_id,
    name: dbPublishingChannel.name,
    description: dbPublishingChannel.description,
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
        name VARCHAR(64) NOT NULL,
        description VARCHAR(64) NOT NULL,

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
  }: {
    controller: Controller;
    publishingChannelId: string;
    ownerUserId: string;
    name: string;
    description: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "publishing_channel_id", value: publishingChannelId },
            { field: "owner_user_id", value: ownerUserId },
            { field: "name", value: name },
            { field: "description", value: description },
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

  public async maybeGetPublishingChannelByPublishingChannelId({
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
          "Error at publishedItemsTableService.selectPublishingChannelByPublishingChannelId",
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
  }: {
    controller: Controller;

    publishingChannelId: string;
    name: string;
    description: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishingChannel>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "name", value: name },
          {
            field: "description",
            value: description,
            settings: { includeIfEmpty: true },
          },
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
