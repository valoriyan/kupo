import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericCreateRowQueryString } from "./utilities";

interface DBUserFollow {
  user_id_doing_following: string;
  user_id_being_followed: string;
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
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<void> {
    const queryString = generatePSQLGenericCreateRowQueryString<string | number>({
      rows: [
        { field: "user_id_doing_following", value: userIdDoingFollowing },
        { field: "user_id_being_followed", value: userIdBeingFollowed },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserIdsFollowedByUserId({
    userIdDoingFollowing,
  }: {
    userIdDoingFollowing: string;
  }): Promise<string[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${UserFollowsTableService.tableName}
        WHERE
          user_id_doing_following = '${userIdDoingFollowing}'
        ;
      `;

    const response: QueryResult<DBUserFollow> = await this.datastorePool.query(
      queryString,
    );
    const rows = response.rows;

    const userIdsBeingFollowed = rows.map((row) => row.user_id_being_followed);
    return userIdsBeingFollowed;
  }

  public async countFollowersOfUserId({
    userIdBeingFollowed,
  }: {
    userIdBeingFollowed: string;
  }): Promise<number> {
    const queryString = `
        SELECT
          COUNT(*)
        FROM
          ${UserFollowsTableService.tableName}
        WHERE
          user_id_being_followed = '${userIdBeingFollowed}'
        ;
      `;

    const response: QueryResult<{
      count: number;
    }> = await this.datastorePool.query(queryString);

    return response.rows[0].count;
  }

  public async countFollowsOfUserId({
    userIdDoingFollowing,
  }: {
    userIdDoingFollowing: string;
  }): Promise<number> {
    const queryString = `
        SELECT
          COUNT(*)
        FROM
          ${UserFollowsTableService.tableName}
        WHERE
          user_id_doing_following = '${userIdDoingFollowing}'
        ;
      `;

    const response: QueryResult<{
      count: number;
    }> = await this.datastorePool.query(queryString);

    return response.rows[0].count;
  }
  public async isUserIdFollowingUserId({
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<boolean> {
    const queryString = `
      SELECT
        COUNT(*)
      FROM
        ${UserFollowsTableService.tableName}
      WHERE
        user_id_doing_following = '${userIdDoingFollowing}'
      AND
        user_id_being_followed = '${userIdBeingFollowed}'
      LIMIT
        1
      ;
    `;

    const response: QueryResult<DBUserFollow> = await this.datastorePool.query(
      queryString,
    );

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
    const queryString = `
      DELETE FROM ${UserFollowsTableService.tableName}
      WHERE
        user_id_doing_following = '${userIdDoingUnfollowing}'
      AND
        user_id_being_followed = '${userIdBeingUnfollowed}'
      ;
    `;

    await this.datastorePool.query(queryString);
  }
}
