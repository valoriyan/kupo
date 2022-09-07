/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../../utilities/monads";
import { Controller } from "tsoa";

import { TableService } from "../../models";
import { UsersTableService } from "../../users/usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../../controllers/models";
import { PublishingChannelsTableService } from "../publishingChannelsTableService";
import { generatePSQLGenericDeleteRowsQueryString } from "../../utilities";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBPublishingChannelModerator {
  publishing_channel_id: string;
  user_id: string;
  creation_timestamp: string;
}

export class PublishingChannelModeratorsTableService extends TableService {
  public static readonly tableName = `publishing_channel_moderators`;
  public readonly tableName = PublishingChannelModeratorsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    PublishingChannelsTableService.tableName,
    UsersTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        publishing_channel_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (publishing_channel_id, user_id),

        CONSTRAINT ${this.tableName}_${PublishingChannelsTableService.tableName}_fkey
          FOREIGN KEY (publishing_channel_id)
          REFERENCES ${PublishingChannelsTableService.tableName} (publishing_channel_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async registerPublishingChannelModerator({
    controller,
    publishingChannelId,
    userId,
    creationTimestamp,
  }: {
    controller: Controller;
    publishingChannelId: string;
    userId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "publishing_channel_id", value: publishingChannelId },
            { field: "user_id", value: userId },
            { field: "creation_timestamp", value: creationTimestamp },
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
          "Error at PublishingChannelModeratorsTableService.registerPublishingChannelModerator",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectPublishingChannelModeratorUserIdsByPublishingChannelId({
    controller,
    publishingChannelId,
  }: {
    controller: Controller;
    publishingChannelId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const values = [publishingChannelId];

      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_id = $1
          ORDER BY
            creation_timestamp DESC
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannelModerator> =
        await this.datastorePool.query(query);

      return Success(response.rows.map(({ user_id }) => user_id));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.selectPublishingChannelModeratorUserIdsByPublishingChannelId",
      });
    }
  }

  public async isUserIdAPublishingChannelModeratorOfPublishingChannelId({
    controller,
    userId,
    publishingChannelId,
  }: {
    controller: Controller;
    userId: string;
    publishingChannelId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
    try {
      const values = [userId, publishingChannelId];

      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id = $1
          AND
            publishing_channel_id = $2
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannelModerator> =
        await this.datastorePool.query(query);

      return Success(response.rows.length === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.isUserIdAPublishingChannelModeratorOfPublishingChannelId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removePublishingChannelModerator({
    controller,
    publishingChannelId,
    userId,
  }: {
    controller: Controller;
    publishingChannelId: string;
    userId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelModerator>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "publishing_channel_id", value: publishingChannelId },
          { field: "user_id", value: userId },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelModerator>(
        query,
      );
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at DBPublishingChannel.removePublishingChannelModerator",
      });
    }
  }
}
