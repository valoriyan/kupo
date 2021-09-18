import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

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

  public async createUserFollow({
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${UserFollowsTableService.tableName}(
            user_id_doing_following,
            user_id_being_followed,
        )
        VALUES (
            '${userIdDoingFollowing}',
            '${userIdBeingFollowed}'
        )
        ;
        `;

    await this.datastorePool.query(queryString);
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
