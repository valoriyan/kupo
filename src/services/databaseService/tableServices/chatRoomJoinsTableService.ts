/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { UnrenderableChatRoomWithJoinedUsers } from "../../../controllers/chat/models";

import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";

interface DBChatRoomJoin {
  chat_room_id: string;
  user_id: string;
  join_timestamp: string;
}

function convertDBChatRoomJoinsToUnrenderableChatRoomWithJoinedUsers(
  dbChatRoomMemberships: DBChatRoomJoin[],
): UnrenderableChatRoomWithJoinedUsers[] {
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

export class ChatRoomJoinsTableService extends TableService {
  public static readonly tableName = `chat_room_joins`;
  public readonly tableName = ChatRoomJoinsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        chat_room_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        join_timestamp BIGINT NOT NULL,
        
        CONSTRAINT ${this.tableName}_pkey PRIMARY KEY (chat_room_id, user_id)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async joinUserWithChatRoom({
    controller,
    chatRoomId,
    userId,
    joinTimestamp,
  }: {
    controller: Controller;
    chatRoomId: string;
    userId: string;
    joinTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.joinUserWithChatRoom",
      });
    }
  }

  public async joinUsersWithChatRoom({
    controller,
    chatRoomId,
    userIds,
    joinTimestamp,
  }: {
    controller: Controller;
    chatRoomId: string;
    userIds: string[];
    joinTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.joinUsersWithChatRoom",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUnrenderableChatRoomWithJoinedUsersByChatRoomId({
    controller,
    chatRoomId,
  }: {
    controller: Controller;
    chatRoomId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableChatRoomWithJoinedUsers>
  > {
    try {
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

      const response: QueryResult<DBChatRoomJoin> = await this.datastorePool.query(query);

      const unrenderableChatRoomPreviews =
        convertDBChatRoomJoinsToUnrenderableChatRoomWithJoinedUsers(response.rows);
      if (unrenderableChatRoomPreviews.length === 0) {
        throw new Error("Missing chat room");
      }

      return Success(unrenderableChatRoomPreviews[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.getUnrenderableChatRoomWithJoinedUsersByChatRoomId",
      });
    }
  }

  public async getUserIdsJoinedToChatRoomId({
    controller,
    chatRoomId,
  }: {
    controller: Controller;
    chatRoomId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
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

      const response: QueryResult<DBChatRoomJoin> = await this.datastorePool.query(query);

      return Success(response.rows.map((dbChatRoom) => dbChatRoom.user_id));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.getUserIdsJoinedToChatRoomId",
      });
    }
  }

  public async getChatRoomsJoinedByUserIds({
    controller,
    userIds,
  }: {
    controller: Controller;
    userIds: string[];
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      UnrenderableChatRoomWithJoinedUsers[]
    >
  > {
    try {
      const whereConditionText = userIds
        .map((_, index) => {
          return `
        chat_room_id IN (
          SELECT 
            chat_room_id
          FROM
            ${this.tableName}
          WHERE
            user_id = $${index + 1}
        )
      `;
        })
        .join("\n AND \n");

      const query = {
        text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          ${whereConditionText}
        ;
      `,
        values: userIds,
      };

      const response: QueryResult<DBChatRoomJoin> = await this.datastorePool.query(query);

      const dbChatRoomMemberships = response.rows;

      return Success(
        convertDBChatRoomJoinsToUnrenderableChatRoomWithJoinedUsers(
          dbChatRoomMemberships,
        ),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.getChatRoomsJoinedByUserIds",
      });
    }
  }

  public async getChatRoomIdWithJoinedUserIdMembersExclusive({
    controller,
    userIds,
  }: {
    controller: Controller;
    userIds: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string | undefined>> {
    try {
      const parameterizedUsersList = userIds
        .map((_, index) => `$${index + 1}`)
        .join(", ");

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

      const response: QueryResult<DBChatRoomJoin> = await this.datastorePool.query(query);

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
          return Success(roomId);
        }
      }

      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.getChatRoomIdWithUserIdMembersExclusive",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removeUserFromChatRoomByIds({
    controller,
    chatRoomId,
    userId,
  }: {
    controller: Controller;
    chatRoomId: string;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "chat_room_id", value: chatRoomId },
          { field: "user_id", value: userId },
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
          "Error at ChatRoomJoinsTableService.removeUserFromChatRoomById",
      });
    }
  }
}
