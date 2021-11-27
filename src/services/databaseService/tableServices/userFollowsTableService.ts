import { Pool, QueryResult } from "pg";
import { UnrenderableUserFollow } from "src/controllers/userInteraction/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBUserFollow {
  user_id_doing_following: string;
  user_id_being_followed: string;
  creation_timestamp: number;
}

function convertDBUserFollowToUnrenderableUserFollow(
  dbUserFollow: DBUserFollow,
): UnrenderableUserFollow {
  return {
    userIdDoingFollowing: dbUserFollow.user_id_doing_following,
    userIdBeingFollowed: dbUserFollow.user_id_being_followed,
    timestamp: dbUserFollow.creation_timestamp,
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
        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL,
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
    userIdDoingFollowing,
    userIdBeingFollowed,
    creationTimestamp,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
    creationTimestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "user_id_doing_following", value: userIdDoingFollowing },
          { field: "user_id_being_followed", value: userIdBeingFollowed },
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

  public async getUserIdsFollowingUserId({
    userIdBeingFollowed,
  }: {
    userIdBeingFollowed: string;
  }): Promise<UnrenderableUserFollow[]> {
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

    return rows.map(convertDBUserFollowToUnrenderableUserFollow);
  }


  public async getUserIdsFollowedByUserId({
    userIdDoingFollowing,
  }: {
    userIdDoingFollowing: string;
  }): Promise<string[]> {
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
    return userIdsBeingFollowed;
  }

  public async countFollowersOfUserId({
    userIdBeingFollowed,
  }: {
    userIdBeingFollowed: string;
  }): Promise<number> {
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
      count: number;
    }> = await this.datastorePool.query(query);

    return response.rows[0].count;
  }

  public async countFollowsOfUserId({
    userIdDoingFollowing,
  }: {
    userIdDoingFollowing: string;
  }): Promise<number> {
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
      count: number;
    }> = await this.datastorePool.query(query);

    return response.rows[0].count;
  }
  public async isUserIdFollowingUserId({
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<boolean> {
    const query = {
      text: `
        SELECT
          COUNT(*)
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

    return response.rows.length > 0;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteUserFollow({
    userIdDoingUnfollowing,
    userIdBeingUnfollowed,
  }: {
    userIdDoingUnfollowing: string;
    userIdBeingUnfollowed: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "user_id_doing_following", value: userIdDoingUnfollowing },
        { field: "user_id_being_followed", value: userIdBeingUnfollowed },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
