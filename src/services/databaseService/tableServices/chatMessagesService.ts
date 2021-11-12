import { Pool, QueryResult } from "pg";
import { UnrenderableChatMessage } from "src/controllers/chat/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericCreateRowQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities";

interface DBChatMessage {
  chatMessageId: string;
  text: string;
  authorUserId: string;
  chatRoomId: string;
  creationTimestamp: number;
}

function convertDBChatMessageToUnrenderableChatMessage(
  dbChatMessage: DBChatMessage,
): UnrenderableChatMessage {
  return {
    chatMessageId: dbChatMessage.chatMessageId,
    text: dbChatMessage.text,
    authorUserId: dbChatMessage.authorUserId,
    chatRoomId: dbChatMessage.chatRoomId,
    creationTimestamp: dbChatMessage.creationTimestamp,
  };
}

export class ChatMessagesTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_chat_messages`;
  public readonly tableName = ChatMessagesTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        chat_message_id VARCHAR(64) UNIQUE NOT NULL,
        text VARCHAR(64) NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        chat_room_id VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createChatMessage({
    chatMessageId,
    text,
    authorUserId,
    chatRoomId,
    creationTimestamp,
  }: {
    chatMessageId: string;
    text: string;
    authorUserId: string;
    chatRoomId: string;
    creationTimestamp: number;
  }): Promise<void> {
    const queryString = generatePSQLGenericCreateRowQueryString<string | number>({
      rows: [
        { field: "chat_message_id", value: chatMessageId },
        { field: "text", value: text },
        { field: "author_user_id", value: authorUserId },
        { field: "chat_room_id", value: chatRoomId },
        { field: "creation_timestamp", value: creationTimestamp },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getChatMessagesByChatRoomId({
    chatRoomId,
  }: {
    chatRoomId: string;
  }): Promise<UnrenderableChatMessage[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            chat_room_id = '${chatRoomId}'
        ;
      `;

    const response: QueryResult<DBChatMessage> = await this.datastorePool.query(
      queryString,
    );

    return response.rows.map(convertDBChatMessageToUnrenderableChatMessage);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePost({
    chatMessageId,
    text,
  }: {
    chatMessageId: string;
    text: string;
  }): Promise<void> {
    const queryString = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "text", value: text }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "chat_message_id",
        value: chatMessageId,
      },
      tableName: this.tableName,
    });

    if (!!queryString) {
      await this.datastorePool.query(queryString);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteChatMessage({
    chatMessageId,
  }: {
    chatMessageId: string;
  }): Promise<void> {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE
        chat_message_id = '${chatMessageId}'
      ;
    `;

    await this.datastorePool.query(queryString);
  }
}
