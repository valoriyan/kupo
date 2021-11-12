import { Pool, QueryResult } from "pg";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericCreateRowQueryString,
} from "./utilities";

interface DBChatRoom {
  chatRoomId: string;
  userId: string;
  joinTimestamp: number;
}

export class ChatRoomsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_chat_rooms`;
  public readonly tableName = ChatRoomsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        chat_room_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        join_timestamp BIGINT NOT NULL,
        PRIMARY KEY (chat_room_id, user_id)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async insertUserIntoChatRoom({
    chatRoomId,
    userId,
    joinTimestamp,
  }: {
    chatRoomId: string;
    userId: string;
    joinTimestamp: number;
  }): Promise<void> {
    const queryString = generatePSQLGenericCreateRowQueryString<string | number>({
      rows: [
        { field: "chat_room_id", value: chatRoomId },
        { field: "user_id", value: userId },
        { field: "join_timestamp", value: joinTimestamp },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserIdsJoinedToChatRoomId({
    chatRoomId,
  }: {
    chatRoomId: string;
  }): Promise<string[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
        chat_room_id = '${chatRoomId}'
        ;
      `;

    const response: QueryResult<DBChatRoom> = await this.datastorePool.query(queryString);

    return response.rows.map((dbChatRoom) => dbChatRoom.userId);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removeUserFromChatRoomById({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }): Promise<void> {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE
        chat_room_id = '${chatRoomId}'
        user_id = '${userId}'
      ;
    `;

    await this.datastorePool.query(queryString);
  }
}