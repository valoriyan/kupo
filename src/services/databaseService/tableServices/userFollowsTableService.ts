/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { UnrenderableUserFollow } from "../../../controllers/userInteraction/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";

interface DBUserFollow {
  user_follow_event_id: string;
  user_id_doing_following: string;
  user_id_being_followed: string;
  timestamp: string;
}

function convertDBUserFollowToUnrenderableUserFollow(
  dbUserFollow: DBUserFollow,
): UnrenderableUserFollow {
  return {
    userFollowEventId: dbUserFollow.user_follow_event_id,
    userIdDoingFollowing: dbUserFollow.user_id_doing_following,
    userIdBeingFollowed: dbUserFollow.user_id_being_followed,
    timestamp: parseInt(dbUserFollow.timestamp),
  };
}

export class UserFollowsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_user_follows`;
  public readonly tableName = UserFollowsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_follow_event_id VARCHAR(64) NOT NULL,

        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (user_id_doing_following, user_id_being_followed)
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
    timestamp,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
    userFollowEventId: string;
    timestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_id_doing_following", value: userIdDoingFollowing },
            { field: "user_id_being_followed", value: userIdBeingFollowed },
            { field: "user_follow_event_id", value: userFollowEventId },
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
  }: {
    controller: Controller;
    userIdBeingFollowed: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUserFollow[]>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_being_followed = $1
          ;
        `,
        values: [userIdBeingFollowed],
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
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
          ;
        `,
        values: [userIdDoingFollowing],
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
  }: {
    controller: Controller;
    userIdBeingFollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            user_id_being_followed = $1
          ;
        `,
        values: [userIdBeingFollowed],
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
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            user_id_doing_following = $1
          ;
        `,
        values: [userIdDoingFollowing],
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

  public async isUserIdFollowingUserId({
    controller,
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    controller: Controller;
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
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

      return Success(response.rows.length > 0);
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
