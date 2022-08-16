/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { UnrenderableChatMessage } from "../../../controllers/chat/models";

import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { UsersTableService } from "./usersTableService";

interface DBChatMessage {
  chat_message_id: string;
  text: string;
  author_user_id: string;
  chat_room_id: string;
  creation_timestamp: string;
}

function convertDBChatMessageToUnrenderableChatMessage(
  dbChatMessage: DBChatMessage,
): UnrenderableChatMessage {
  return {
    chatMessageId: dbChatMessage.chat_message_id,
    text: dbChatMessage.text,
    authorUserId: dbChatMessage.author_user_id,
    chatRoomId: dbChatMessage.chat_room_id,
    creationTimestamp: parseInt(dbChatMessage.creation_timestamp),
  };
}

export class ChatMessagesTableService extends TableService {
  public static readonly tableName = `chat_messages`;
  public readonly tableName = ChatMessagesTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        chat_message_id VARCHAR(64) UNIQUE NOT NULL,
        text VARCHAR(64) NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        chat_room_id VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL,
        
        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (chat_message_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (author_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)

      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createChatMessage({
    controller,
    chatMessageId,
    text,
    authorUserId,
    chatRoomId,
    creationTimestamp,
  }: {
    controller: Controller;
    chatMessageId: string;
    text: string;
    authorUserId: string;
    chatRoomId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "chat_message_id", value: chatMessageId },
            { field: "text", value: text },
            { field: "author_user_id", value: authorUserId },
            { field: "chat_room_id", value: chatRoomId },
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
        additionalErrorInformation: "Error at chatMessagesTableService.createChatMessage",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getChatMessagesByChatRoomId({
    controller,
    chatRoomId,
    beforeTimestamp,
  }: {
    controller: Controller;
    chatRoomId: string;
    beforeTimestamp?: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableChatMessage[]>
  > {
    try {
      const values: (string | number)[] = [chatRoomId];

      let beforeTimestampCondition = "";
      if (!!beforeTimestamp) {
        beforeTimestampCondition = `AND creation_timestamp <  $2`;
        values.push(beforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
              chat_room_id = $1
              ${beforeTimestampCondition}
          ORDER BY
            creation_timestamp
          ;
        `,
        values,
      };

      const response: QueryResult<DBChatMessage> = await this.datastorePool.query(query);

      return Success(response.rows.map(convertDBChatMessageToUnrenderableChatMessage));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at chatMessagesTableService.getChatMessagesByChatRoomId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateChatMessage({
    controller,
    chatMessageId,
    text,
  }: {
    controller: Controller;
    chatMessageId: string;
    text: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "text", value: text }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "chat_message_id",
            value: chatMessageId,
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
        additionalErrorInformation: "Error at chatMessagesTableService.updateChatMessage",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteChatMessage({
    controller,
    chatMessageId,
    userId,
  }: {
    controller: Controller;
    chatMessageId: string;
    userId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableChatMessage>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "chat_message_id", value: chatMessageId },
          { field: "author_user_id", value: userId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBChatMessage> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (!!rows.length) {
        const row = response.rows[0];
        return Success(convertDBChatMessageToUnrenderableChatMessage(row));
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "Chat Message not found in chatMessagesTableService.deleteChatMessage",
        additionalErrorInformation: "Error at chatMessagesTableService.deleteChatMessage",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at chatMessagesTableService.deleteChatMessage",
      });
    }
  }
}
