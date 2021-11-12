import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericCreateRowQueryString } from "./utilities";

interface DBHashtag {
  hashtag: string;
  post_id?: string;
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

        post_id VARCHAR(64),
        shop_item_id VARCHAR(64),

        CHECK ((post_id IS NULL) <> (shop_item_id IS NULL))
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async addHashtagsToPost({
    hashtags,
    postId,
  }: {
    hashtags: string[];
    postId: string;
  }): Promise<void> {
    const queryString = hashtags.reduce((previousValue, hashtag): string => {
      return (
        previousValue +
        generatePSQLGenericCreateRowQueryString<string | number>({
          rows: [
            { field: "hashtag", value: hashtag },
            { field: "post_id", value: postId },
          ],
          tableName: this.tableName,
        })
      );
    }, "");

    await this.datastorePool.query<DBHashtag>(queryString);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostIdsWithHashtagId({
    hashtag,
  }: {
    hashtag: string;
  }): Promise<string[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            hashtag = '${hashtag}'
          AND
            post_id IS NOT NULL
        ;
      `;

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(queryString);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const postIds = response.rows.map((row) => row.post_id!);
    return postIds;
  }

  public async getHashtagsForPostId({ postId }: { postId: string }): Promise<string[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
        post_id = '${postId}'
        ;
      `;

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(queryString);

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
