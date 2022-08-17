/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";

import { TableService } from "../models";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { UsersTableService } from "../usersTableService";

export class ChatRoomReadRecordsTableService extends TableService {
  public static readonly tableName = `chat_room_read_records`;
  public readonly tableName = ChatRoomReadRecordsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_id VARCHAR(64) NOT NULL,
        chat_room_id VARCHAR(64) NOT NULL,
        timestamp_last_read_by_user BIGINT NOT NULL,
        
        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (user_id, chat_room_id),

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

  public async recordChatRoomAsReadByUserIdAtTimestamp({
    controller,
    userId,
    chatRoomId,
    timestampLastReadByUser,
  }: {
    controller: Controller;
    userId: string;
    chatRoomId: string;
    timestampLastReadByUser: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = {
        text: `
          INSERT INTO ${this.tableName} (
            user_id,
            chat_room_id,
            timestamp_last_read_by_user
          )
          VALUES (
            $1,
            $2,
            $3
          )
          ON CONFLICT (
            user_id,
            chat_room_id
          )
          DO
            UPDATE SET
              timestamp_last_read_by_user = EXCLUDED.timestamp_last_read_by_user
          ;
        `,
        values: [userId, chatRoomId, timestampLastReadByUser],
      };

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomReadRecordsTableService.recordChatRoomAsReadByUserIdAtTimestamp",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getCountOfChatRoomsReadByUserIdBeforeTimestamp({
    controller,
    userId,
    timestamp,
  }: {
    controller: Controller;
    userId: string;
    timestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
              user_id = $1
            AND
              timestamp_last_read_by_user < $2
          ;
        `,
        values: [userId, timestamp],
      };

      const response: QueryResult<{ count: string }> = await this.datastorePool.query(
        query,
      );
      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomReadRecordsTableService.getCountOfChatRoomsReadByUserIdBeforeTimestamp",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
