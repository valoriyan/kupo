/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { UnrenderableChatRoomWithJoinedUsers } from "../../../../controllers/chat/models";

import { TableService } from "../models";
import { generatePSQLGenericDeleteRowsQueryString } from "../utilities";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { UsersTableService } from "../users/usersTableService";
import { ChatRoomReadRecordsTableService } from "./chatRoomReadRecordsTableService";
import { ChatMessagesTableService } from "./chatMessagesTableService";

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

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        chat_room_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        join_timestamp BIGINT NOT NULL,
        
        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (chat_room_id, user_id),

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

  public async getCountOfUnreadChatRoomsByUserId({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
          (
            SELECT
              ${ChatRoomJoinsTableService.tableName}.chat_room_id
            FROM
              ${ChatRoomJoinsTableService.tableName}	
            INNER JOIN
              ${ChatMessagesTableService.tableName}
                ON
                  ${ChatRoomJoinsTableService.tableName}.chat_room_id = ${ChatMessagesTableService.tableName}.chat_room_id
            LEFT JOIN
              ${ChatRoomReadRecordsTableService.tableName}
                ON
                  ${ChatRoomJoinsTableService.tableName}.chat_room_id = ${ChatRoomReadRecordsTableService.tableName}.chat_room_id
                AND	
                  ${ChatRoomJoinsTableService.tableName}.user_id = ${ChatRoomReadRecordsTableService.tableName}.user_id
            WHERE
                ${ChatRoomJoinsTableService.tableName}.user_id = $1
              AND
                ${ChatMessagesTableService.tableName}.author_user_id != $1
              AND (
                  ${ChatRoomReadRecordsTableService.tableName}.timestamp_last_read_by_user IS NULL
                OR
                  ${ChatRoomReadRecordsTableService.tableName}.timestamp_last_read_by_user < ${ChatMessagesTableService.tableName}.creation_timestamp
              )
            GROUP BY
              ${ChatRoomJoinsTableService.tableName}.chat_room_id
          ) as subquery
          ;
        `,
        values: [userId],
      };

      const response: QueryResult<{ count: string }> = await this.datastorePool.query(
        query,
      );

      return Success(parseInt(response.rows[0].count, 10));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at ChatRoomJoinsTableService.getCountOfUnreadChatRoomsByUserId",
      });
    }
  }

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
    userIds: Set<string>;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string | undefined>> {
    try {
      const countOfUsers = userIds.size;

      const queryValues: (string | number)[] = [countOfUsers];

      const parameterizedUsersList: string[] = [];
      [...userIds].forEach((userId) => {
        parameterizedUsersList.push(`$${queryValues.length + 1}`);
        queryValues.push(userId);
      });
      const parameterizedUsersListText = parameterizedUsersList.join(", ");

      //////////////////////////////////////////////////
      // 1) Get the list of chat room ids that contain the users (and maybe more users)
      // 2) Get all rows for chat rooms in step 1
      //////////////////////////////////////////////////

      const query = {
        text: `
          SELECT
            chat_room_id
          FROM
            ${this.tableName}
          WHERE
            chat_room_id in (
              SELECT
                chat_room_id
              FROM
                ${this.tableName}
              WHERE
                user_id IN ( ${parameterizedUsersListText} )
            )
          GROUP BY
            chat_room_id
          HAVING
            count(chat_room_id) = $1
        
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<{ chat_room_id: string }> =
        await this.datastorePool.query(query);

      const matchingChatRoomIds = response.rows;

      if (matchingChatRoomIds.length > 1) {
        return Failure({
          controller,
          httpStatusCode: 500,
          reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
          additionalErrorInformation:
            "This should not be possible to encounter - the PSQL query must be incorrect; Error at ChatRoomJoinsTableService.getChatRoomIdWithJoinedUserIdMembersExclusive",
        });
      } else if (matchingChatRoomIds.length === 1) {
        const matchingChatRoomId = matchingChatRoomIds[0].chat_room_id;
        return Success(matchingChatRoomId);
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

  public async getCountOfChatRoomsJoinedByUserId({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
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
          ;
        `,
        values: [userId],
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
          "Error at ChatRoomJoinsTableService.getCountOfChatRoomsJoinedByUserId",
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
