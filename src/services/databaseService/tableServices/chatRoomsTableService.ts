import { Pool, QueryResult } from "pg";
import { UnrenderableChatRoom } from "src/controllers/chat/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBChatRoomMembership {
  chatRoomId: string;
  userId: string;
  joinTimestamp: number;
}

function convertDBChatRoomMembershipsToUnrenderableChatRooms(
  dbChatRoomMemberships: DBChatRoomMembership[],
): UnrenderableChatRoom[] {
  // const chatRoomIdToUserIdsMap: {[chatRoomId: string]: Set<string>} = {};
  const chatRoomIdToUserIdsMap: Map<string, Set<string>> = new Map();

  dbChatRoomMemberships.forEach(({ chatRoomId, userId }) => {
    const chatRoomMembers = chatRoomIdToUserIdsMap.get(chatRoomId) || new Set();
    chatRoomMembers.add(userId);
    chatRoomIdToUserIdsMap.set(chatRoomId, chatRoomMembers);
  });

  return [...chatRoomIdToUserIdsMap.entries()].map(([chatRoomId, memberUserIds]) => {
    return {
      chatRoomId,
      memberUserIds: [...memberUserIds],
    };
  });
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
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "chat_room_id", value: chatRoomId },
          { field: "user_id", value: userId },
          { field: "join_timestamp", value: joinTimestamp },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserIdsJoinedToChatRoomId({
    chatRoomId,
  }: {
    chatRoomId: string;
  }): Promise<string[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          chat_room_id = $1
        ;
      `,
      values: [chatRoomId],
    };

    const response: QueryResult<DBChatRoomMembership> = await this.datastorePool.query(
      query,
    );

    return response.rows.map((dbChatRoom) => dbChatRoom.userId);
  }

  public async getChatRoomsJoinedByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UnrenderableChatRoom[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          userId = $1
        ;
      `,
      values: [userId],
    };

    const response: QueryResult<DBChatRoomMembership> = await this.datastorePool.query(
      query,
    );

    const dbChatRoomMemberships = response.rows;

    return convertDBChatRoomMembershipsToUnrenderableChatRooms(dbChatRoomMemberships);
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
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "chat_room_id", value: chatRoomId },
        { field: "user_id", value: userId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
