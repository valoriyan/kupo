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
import { UsersTableService } from "../../usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../../controllers/models";
import { PublishingChannelsTableService } from "../publishingChannelsTableService";
import { generatePSQLGenericDeleteRowsQueryString } from "../../utilities";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBPublishingChannelUserBan {
  publishing_channel_id: string;
  banned_user_id: string;
  executor_user_id: string;
  execution_timestamp: string;
}

export class PublishingChannelUserBansTableService extends TableService {
  public static readonly tableName = `publishing_channel_user_bans`;
  public readonly tableName = PublishingChannelUserBansTableService.tableName;

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
        banned_user_id VARCHAR(64) NOT NULL,
        executor_user_id VARCHAR(64) NOT NULL,
        execution_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (publishing_channel_id, banned_user_id),

        CONSTRAINT ${this.tableName}_${PublishingChannelsTableService.tableName}_fkey
          FOREIGN KEY (publishing_channel_id)
          REFERENCES ${PublishingChannelsTableService.tableName} (publishing_channel_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_banned_fkey
          FOREIGN KEY (banned_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_executor_fkey
          FOREIGN KEY (executor_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async executeBanOfUserIdForPublishingChannelId({
    controller,
    publishingChannelId,
    bannedUserId,
    executorUserId,
    executionTimestamp,
  }: {
    controller: Controller;
    publishingChannelId: string;
    bannedUserId: string;
    executorUserId: string;
    executionTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "publishing_channel_id", value: publishingChannelId },
            { field: "banned_user_id", value: bannedUserId },
            { field: "executor_user_id", value: executorUserId },
            { field: "execution_timestamp", value: executionTimestamp },
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
          "Error at PublishingChannelUserBansTableService.executeBanOfUserIdForPublishingChannelId",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async isUserIdBannedFromPublishingChannelId({
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
            banned_user_id = $1
          AND
            publishing_channel_id = $2
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannelUserBan> =
        await this.datastorePool.query(query);

      return Success(response.rows.length === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelUserBansTableService.isUserIdBannedFromPublishingChannelId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removeBanFromUserIdForPublishingChannelId({
    controller,
    userId,
    publishingChannelId,
  }: {
    controller: Controller;
    userId: string;
    publishingChannelId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelUserBan>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "banned_user_id", value: userId },
          { field: "publishing_channel_id", value: publishingChannelId },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelUserBan>(query);
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelUserBansTableService.removeBanFromUserIdForPublishingChannelId",
      });
    }
  }
}
