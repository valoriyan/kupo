import { Pool, QueryConfig, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBHashtag {
  hashtag: string;
  published_item_id: string;
}

export class HashtagsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_hashtags`;
  public readonly tableName = HashtagsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        hashtag VARCHAR(64) NOT NULL,

        published_item_id VARCHAR(64) NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async addHashtagsToPublishedItem({
    hashtags,
    publishedItemId,
  }: {
    hashtags: string[];
    publishedItemId: string;
  }): Promise<void> {
    if (hashtags.length === 0) {
      return;
    }

    const rowsOfFieldsAndValues = hashtags.map((hashtag) => [
      { field: "hashtag", value: hashtag },
      {
        field: "published_item_id",
        value: `${publishedItemId}`,
      },
    ]);

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues,
      tableName: this.tableName,
    });

    await this.datastorePool.query<DBHashtag>(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishedItemsWithHashtag({
    hashtag,
  }: {
    hashtag: string;
  }): Promise<string[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            hashtag = $1
        ;
      `,
      values: [hashtag],
    };

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

    const publishedItemIds = response.rows.map((row) => row.published_item_id);
    return publishedItemIds;
  }

  public async getPublishedItemIdsWithOneOfHashtags({
    hashtagSubstring,
  }: {
    hashtagSubstring: string;
  }): Promise<string[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            hashtag LIKE CONCAT('%', $1::text, '%')
        ;
      `,
      values: [hashtagSubstring],
    };

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

    const publishedItemIds = response.rows.map((row) => row.published_item_id);
    return publishedItemIds;
  }

  public async getHashtagsForPublishedItemId({
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

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

    const hashtags = response.rows.map((row) => row.hashtag);
    return hashtags;
  }

  public async getHashtagsCountBySubstring({
    hashtagSubstring,
  }: {
    hashtagSubstring: string;
  }) {
    const query: QueryConfig = {
      text: `
        SELECT
          COUNT(DISTINCT hashtag) as count
        FROM
          ${this.tableName}
        WHERE
          hashtag LIKE CONCAT('%', $1::text, '%')
        ;
      `,
      values: [hashtagSubstring],
    };

    const response: QueryResult<{ count: string }> = await this.datastorePool.query(
      query,
    );

    return parseInt(response.rows[0].count);
  }

  public async getHashtagsMatchingSubstring({
    hashtagSubstring,
    pageNumber,
    pageSize,
  }: {
    hashtagSubstring: string;
    pageNumber: number;
    pageSize: number;
  }): Promise<string[]> {
    const offset = pageSize * pageNumber - pageSize;

    const query: QueryConfig = {
      text: `
        SELECT DISTINCT
          hashtag
        FROM
          ${this.tableName}
        WHERE
          hashtag LIKE CONCAT('%', $1::text, '%')
        LIMIT
          $2
        OFFSET
          $3
        ;
      `,
      values: [hashtagSubstring, pageSize, offset],
    };

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

    const hashtags = response.rows.map((row) => row.hashtag);
    return hashtags;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
