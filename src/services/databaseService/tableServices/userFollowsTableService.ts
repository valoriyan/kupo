import { Pool, QueryResult } from "pg";
import { UnrenderableUserFollow } from "../../../controllers/userInteraction/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

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
    userIdDoingFollowing,
    userIdBeingFollowed,
    userFollowEventId,
    timestamp,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
    userFollowEventId: string;
    timestamp: number;
  }): Promise<void> {
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
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserFollowEventById({
    userFollowEventId,
  }: {
    userFollowEventId: string;
  }): Promise<UnrenderableUserFollow> {
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

    return convertDBUserFollowToUnrenderableUserFollow(rows[0]);
  }

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
      count: string;
    }> = await this.datastorePool.query(query);

    return parseInt(response.rows[0].count);
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
      count: string;
    }> = await this.datastorePool.query(query);

    if (response.rows.length === 0) {
      throw new Error("Missing follow event");
    }

    return parseInt(response.rows[0].count);
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
  }): Promise<DBUserFollow> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "user_id_doing_following", value: userIdDoingUnfollowing },
        { field: "user_id_being_followed", value: userIdBeingUnfollowed },
      ],
      tableName: this.tableName,
    });

    const response = await this.datastorePool.query<DBUserFollow>(query);
    return response.rows[0];
  }
}
