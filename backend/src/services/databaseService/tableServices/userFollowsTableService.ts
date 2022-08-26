/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  UnrenderableUserFollow,
  UserFollowingStatus,
} from "../../../controllers/user/userInteraction/models";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { UsersTableService } from "./usersTableService";

interface DBUserFollow {
  user_follow_event_id: string;
  user_id_doing_following: string;
  user_id_being_followed: string;
  is_pending: boolean;
  timestamp: string;
}

function convertDBUserFollowToUnrenderableUserFollow(
  dbUserFollow: DBUserFollow,
): UnrenderableUserFollow {
  return {
    userFollowEventId: dbUserFollow.user_follow_event_id,
    userIdDoingFollowing: dbUserFollow.user_id_doing_following,
    userIdBeingFollowed: dbUserFollow.user_id_being_followed,
    isPending: dbUserFollow.is_pending,
    timestamp: parseInt(dbUserFollow.timestamp),
  };
}

export class UserFollowsTableService extends TableService {
  public static readonly tableName = `user_follows`;
  public readonly tableName = UserFollowsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_follow_event_id VARCHAR(64) NOT NULL,

        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        is_pending boolean NOT NULL,
        timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (user_id_doing_following, user_id_being_followed),

        CONSTRAINT doing_following_${this.tableName}_${UsersTableService.tableName}_following_fkey
          FOREIGN KEY (user_id_doing_following)
          REFERENCES ${UsersTableService.tableName} (user_id),

        CONSTRAINT being_followed_${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id_being_followed)
          REFERENCES ${UsersTableService.tableName} (user_id)

      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createUserFollow({
    controller,
    userIdDoingFollowing,
    userIdBeingFollowed,
    userFollowEventId,
    isPending,
    timestamp,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
    userFollowEventId: string;
    isPending: boolean;
    timestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const is_pending_value = !!isPending ? "true" : "false";

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_id_doing_following", value: userIdDoingFollowing },
            { field: "user_id_being_followed", value: userIdBeingFollowed },
            { field: "user_follow_event_id", value: userFollowEventId },
            { field: "is_pending", value: is_pending_value },
            { field: "timestamp", value: timestamp },
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
        additionalErrorInformation: "Error at userFollowsTableService.ErrorReasonTypes",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserFollowEventById({
    controller,
    userFollowEventId,
  }: {
    controller: Controller;
    userFollowEventId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUserFollow>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_follow_event_id = $1
          ;
        `,
        values: [userFollowEventId],
      };

      const response: QueryResult<DBUserFollow> = await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(convertDBUserFollowToUnrenderableUserFollow(rows[0]));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.getUserFollowEventById",
      });
    }
  }

  public async getUserIdsFollowingUserId({
    controller,
    userIdBeingFollowed,
    areFollowsPending,
    limit,
    createdBeforeTimestamp,
  }: {
    controller: Controller;
    userIdBeingFollowed: string;
    areFollowsPending: boolean;
    limit?: number;
    createdBeforeTimestamp?: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUserFollow[]>
  > {
    try {
      const queryValues: (string | number)[] = [userIdBeingFollowed];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let beforeTimestampClause = "";
      if (!!createdBeforeTimestamp) {
        beforeTimestampClause = `
          AND
            timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(createdBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_being_followed = $1
            ${pendingConstraintClause}
            ${beforeTimestampClause}
          ${limitClause}

          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBUserFollow> = await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows.map(convertDBUserFollowToUnrenderableUserFollow));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.getUserIdsFollowingUserId",
      });
    }
  }

  public async getUserIdsFollowedByUserId({
    controller,
    userIdDoingFollowing,
    areFollowsPending,
    limit,
    createdBeforeTimestamp,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    areFollowsPending: boolean;
    limit?: number;
    createdBeforeTimestamp?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const queryValues: (string | number)[] = [userIdDoingFollowing];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let beforeTimestampClause = "";
      if (!!createdBeforeTimestamp) {
        beforeTimestampClause = `
          AND
            timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(createdBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
            ${pendingConstraintClause}
            ${beforeTimestampClause}
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBUserFollow> = await this.datastorePool.query(query);
      const rows = response.rows;

      const userIdsBeingFollowed = rows.map((row) => row.user_id_being_followed);
      return Success(userIdsBeingFollowed);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.getUserIdsFollowedByUserId",
      });
    }
  }

  public async countFollowersOfUserId({
    controller,
    userIdBeingFollowed,
    areFollowsPending,
  }: {
    controller: Controller;
    userIdBeingFollowed: string;
    areFollowsPending: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const queryValues: (string | number)[] = [userIdBeingFollowed];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            user_id_being_followed = $1
            ${pendingConstraintClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.countFollowersOfUserId",
      });
    }
  }

  public async countFollowsOfUserId({
    controller,
    userIdDoingFollowing,
    areFollowsPending,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    areFollowsPending: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const queryValues: (string | number)[] = [userIdDoingFollowing];

      const pendingConstraintClause = `
        AND
          is_pending = $${queryValues.length + 1}
      `;
      const is_pending_value = !!areFollowsPending ? "true" : "false";
      queryValues.push(is_pending_value);

      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
            ${pendingConstraintClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      if (response.rows.length === 0) {
        throw new Error("Missing follow event");
      }

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.countFollowsOfUserId",
      });
    }
  }

  public async getFollowingStatusOfUserIdToUserId({
    controller,
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UserFollowingStatus>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
          AND
            user_id_being_followed = $2
          LIMIT
            1
          ;
        `,
        values: [userIdDoingFollowing, userIdBeingFollowed],
      };

      const response: QueryResult<DBUserFollow> = await this.datastorePool.query(query);

      if (response.rows.length === 0) {
        return Success(UserFollowingStatus.not_following);
      }

      const userFollow = response.rows[0];
      if (!!userFollow.is_pending) {
        Success(UserFollowingStatus.pending);
      }

      return Success(UserFollowingStatus.is_following);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userFollowsTableService.isUserIdFollowingUserId",
      });
    }
  }
  

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////
  public async approvePendingFollow({
    controller,
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUserFollow>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "is_pending", value: "false" }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id_doing_following",
            value: userIdDoingFollowing,
          },
          {
            field: "user_id_being_followed",
            value: userIdBeingFollowed,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBUserFollow> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserFollowToUnrenderableUserFollow(rows[0]));
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation:
          "Error at UserFollowsTableService.approvePendingFollow",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserFollowsTableService.approvePendingFollow",
      });
    }
  }
  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteUserFollow({
    controller,
    userIdDoingUnfollowing,
    userIdBeingUnfollowed,
  }: {
    controller: Controller;
    userIdDoingUnfollowing: string;
    userIdBeingUnfollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserFollow>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "user_id_doing_following", value: userIdDoingUnfollowing },
          { field: "user_id_being_followed", value: userIdBeingUnfollowed },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBUserFollow>(query);
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at userFollowsTableService.deleteUserFollow",
      });
    }
  }
}
