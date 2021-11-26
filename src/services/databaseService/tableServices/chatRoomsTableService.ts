import { Pool, QueryResult } from "pg";
import { UnrenderableChatRoomPreview } from "src/controllers/chat/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBChatRoomMembership {
  chat_room_id: string;
  user_id: string;
  join_timestamp: number;
}

function convertDBChatRoomMembershipsToUnrenderableChatRooms(
  dbChatRoomMemberships: DBChatRoomMembership[],
): UnrenderableChatRoomPreview[] {
  // const chatRoomIdToUserIdsMap: {[chatRoomId: string]: Set<string>} = {};
  const chatRoomIdToUserIdsMap: Map<string, Set<string>> = new Map();

  dbChatRoomMemberships.forEach(({ chat_room_id, user_id }) => {
    const chatRoomMembers = chatRoomIdToUserIdsMap.get(chat_room_id) || new Set();
    chatRoomMembers.add(user_id);
    chatRoomIdToUserIdsMap.set(chat_room_id, chatRoomMembers);
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

  public async insertUsersIntoChatRoom({
    chatRoomId,
    userIds,
    joinTimestamp,
  }: {
    chatRoomId: string;
    userIds: string[];
    joinTimestamp: number;
  }): Promise<void> {
    const rowsOfFieldsAndValues = userIds.map((userId) => [
      { field: "chat_room_id", value: chatRoomId },
      { field: "user_id", value: userId },
      { field: "join_timestamp", value: joinTimestamp },
    ]);

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: rowsOfFieldsAndValues,
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getChatRoomById({
    chatRoomId,
  }: {
    chatRoomId: string;
  }): Promise<UnrenderableChatRoomPreview> {
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

    const unrenderableChatRoomPreviews = convertDBChatRoomMembershipsToUnrenderableChatRooms(response.rows);
    if (unrenderableChatRoomPreviews.length === 0) {
      throw new Error("Missing chat room");
    }

    return unrenderableChatRoomPreviews[0];
  }

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

    return response.rows.map((dbChatRoom) => dbChatRoom.user_id);
  }

  public async getChatRoomsJoinedByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UnrenderableChatRoomPreview[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          chat_room_id IN (
            SELECT 
              chat_room_id
            FROM
              ${this.tableName}
            WHERE
              user_id = $1
          )
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

  public async getChatRoomIdWithUserIdMembersExclusive({
    userIds,
  }: {
    userIds: string[];
  }): Promise<string | undefined> {
    const parameterizedUsersList = userIds.map((_, index) => `$${index + 1}`).join(", ");

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          user_id IN ( ${parameterizedUsersList} )
        ;
      `,
      values: userIds,
    };

    const response: QueryResult<DBChatRoomMembership> = await this.datastorePool.query(
      query,
    );

    const dbChatRoomMemberships = response.rows;

    const mapOfRoomIdsToMemberUserIds: Map<string, Set<string>> = new Map();
    dbChatRoomMemberships.forEach((dbChatRoomMembership) => {
      const { user_id, chat_room_id } = dbChatRoomMembership;
      const members: Set<string> = mapOfRoomIdsToMemberUserIds.has(chat_room_id)
        ? mapOfRoomIdsToMemberUserIds.get(chat_room_id)!
        : new Set();

      members.add(user_id);
      mapOfRoomIdsToMemberUserIds.set(chat_room_id, members);
    });

    for (const [roomId, members] of mapOfRoomIdsToMemberUserIds) {
      if (userIds.every((userId) => members.has(userId))) {
        return roomId;
      }
    }

    return;
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
