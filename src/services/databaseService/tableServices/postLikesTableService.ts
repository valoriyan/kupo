import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPostLike {
  post_id: string;
  user_id: string;
  timestamp: string;
}

export class PostLikesTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_post_likes`;
  public readonly tableName = PostLikesTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          post_id VARCHAR(64) NOT NULL,
          user_id VARCHAR(64) NOT NULL,
          timestamp BIGINT NOT NULL,
          PRIMARY KEY (post_id, user_id)
        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPostLikeFromUserId({
    postId,
    userId,
    timestamp,
  }: {
    postId: string;
    userId: string;
    timestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "post_id", value: postId },
          { field: "user_id", value: userId },
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

  public async getUserIdsLikingPostId({ postId }: { postId: string }): Promise<string[]> {
    const query = {
      text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            post_id = $1
          ;
        `,
      values: [postId],
    };

    const response: QueryResult<DBPostLike> = await this.datastorePool.query(query);
    const rows = response.rows;

    return rows.map((row) => row.user_id);
  }

  public async countLikesOnPostId({ postId }: { postId: string }): Promise<number> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            post_id = $1
          ;
        `,
      values: [postId],
    };

    const response: QueryResult<{
      count: number;
    }> = await this.datastorePool.query(query);

    return response.rows[0].count;
  }

  public async doesUserIdLikePostId({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            post_id = $1
          AND
            user_id = $2
          ;
        `,
      values: [postId, userId],
    };

    const response: QueryResult<{
      count: string;
    }> = await this.datastorePool.query(query);

    return parseInt(response.rows[0].count) === 1;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removePostLikeByUserId({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "post_id", value: postId },
        { field: "user_id", value: userId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
