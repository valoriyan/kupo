import { Pool, QueryResult } from "pg";
import { UnrenderableChatMessage } from "src/controllers/chat/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBChatMessage {
  chat_message_id: string;
  text: string;
  author_user_id: string;
  chat_room_id: string;
  creation_timestamp: number;
}

function convertDBChatMessageToUnrenderableChatMessage(
  dbChatMessage: DBChatMessage,
): UnrenderableChatMessage {
  return {
    chatMessageId: dbChatMessage.chat_message_id,
    text: dbChatMessage.text,
    authorUserId: dbChatMessage.author_user_id,
    chatRoomId: dbChatMessage.chat_room_id,
    creationTimestamp: dbChatMessage.creation_timestamp,
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
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getChatMessagesByChatRoomId({
    chatRoomId,
    beforeTimestamp,
  }: {
    chatRoomId: string;
    beforeTimestamp?: number;
  }): Promise<UnrenderableChatMessage[]> {
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
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "text", value: text }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "chat_message_id",
        value: chatMessageId,
      },
      tableName: this.tableName,
    });

    if (!isQueryEmpty({ query })) {
      await this.datastorePool.query(query);
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
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "chat_message_id", value: chatMessageId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
