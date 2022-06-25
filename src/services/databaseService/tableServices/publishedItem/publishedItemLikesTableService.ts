import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../../config";
import { TableService } from "../models";
import { generatePSQLGenericDeleteRowsQueryString } from "../utilities";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPublishedItemLike {
  published_item_like_id: string;
  published_item_id: string;
  user_id: string;
  timestamp: string;
}

export class PublishedItemLikesTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_published_item_likes`;
  public readonly tableName = PublishedItemLikesTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          published_item_like_id VARCHAR(64) UNIQUE NOT NULL,
          published_item_id VARCHAR(64) NOT NULL,
          user_id VARCHAR(64) NOT NULL,
          timestamp BIGINT NOT NULL,
          PRIMARY KEY (published_item_id, user_id)
        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishedItemLikeFromUserId({
    publishedItemLikeId,
    publishedItemId,
    userId,
    timestamp,
  }: {
    publishedItemLikeId: string;
    publishedItemId: string;
    userId: string;
    timestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "published_item_like_id", value: publishedItemLikeId },
          { field: "published_item_id", value: publishedItemId },
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

  public async getPostLikeByPublishedItemLikeId({
    publishedItemLikeId,
  }: {
    publishedItemLikeId: string;
  }): Promise<DBPublishedItemLike> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          published_item_like_id = $1
        LIMIT
          1
        ;
      `,
      values: [publishedItemLikeId],
    };

    const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
      query,
    );

    if (response.rows.length < 1) {
      throw new Error("Missing post like - getPostLikeByPublishedItemLikeId");
    }

    return response.rows[0];
  }

  public async getPostLikesByPublishedItemId({
    publishedItemId,
  }: {
    publishedItemId: string;
  }): Promise<DBPublishedItemLike[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          published_item_id = $1
        ;
      `,
      values: [publishedItemId],
    };

    const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
      query,
    );

    return response.rows;
  }

  public async getUserIdsLikingPublishedItemId({
    publishedItemId,
  }: {
    publishedItemId: string;
  }): Promise<string[]> {
    const query = {
      text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_id = $1
          ;
        `,
      values: [publishedItemId],
    };

    const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
      query,
    );
    const rows = response.rows;

    return rows.map((row) => row.user_id);
  }

  public async countLikesOnPublishedItemId({
    publishedItemId,
  }: {
    publishedItemId: string;
  }): Promise<number> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            published_item_id = $1
          ;
        `,
      values: [publishedItemId],
    };

    const response: QueryResult<{
      count: string;
    }> = await this.datastorePool.query(query);

    return parseInt(response.rows[0].count);
  }

  public async doesUserIdLikePublishedItemId({
    publishedItemId,
    userId,
  }: {
    publishedItemId: string;
    userId: string;
  }): Promise<boolean> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            published_item_id = $1
          AND
            user_id = $2
          ;
        `,
      values: [publishedItemId, userId],
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

  public async removePublishedItemLikeByUserId({
    publishedItemId,
    userId,
  }: {
    publishedItemId: string;
    userId: string;
  }): Promise<DBPublishedItemLike> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "published_item_id", value: publishedItemId },
        { field: "user_id", value: userId },
      ],
      tableName: this.tableName,
    });

    const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
      query,
    );

    if (response.rows.length < 1) {
      throw new Error("Missing post like - none to delete");
    }

    return response.rows[0];
  }

  public async removeAllPostLikesByPublishedItemId({
    publishedItemId,
  }: {
    publishedItemId: string;
  }): Promise<DBPublishedItemLike> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "published_item_id", value: publishedItemId },
      ],
      tableName: this.tableName,
    });

    const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
      query,
    );

    if (response.rows.length < 1) {
      throw new Error("Missing post like - none to delete");
    }

    return response.rows[0];
  }
}
