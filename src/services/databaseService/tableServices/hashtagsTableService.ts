import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

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
    console.log(`${this.tableName}|addHashtagsToPost`);

    const rowsOfFieldsAndValues = hashtags.map(
      (hashtag) => [
        { field: "hashtag", value: hashtag },
        {
          field: "post_id",
          value: `${postId}`,
        },
      ],
    );

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues,
      tableName: this.tableName,
    });


    await this.datastorePool.query<DBHashtag>(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostIdsWithHashtagId({
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
          AND
            post_id IS NOT NULL
        ;
      `,
      values: [hashtag],
    };

    const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const postIds = response.rows.map((row) => row.post_id!);
    return postIds;
  }

  public async getHashtagsForPostId({ postId }: { postId: string }): Promise<string[]> {
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
