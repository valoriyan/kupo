import { Pool } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBHashtag {
  hashtag: string;
  post_id?: string;
}

export class HashtagTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_hashtags`;
  public readonly tableName = HashtagTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        hashtag VARCHAR(64) NOT NULL,

        post_id VARCHAR(64) NOT NULL,
        shop_item_id VARCHAR(64) NOT NULL,
        UNIQUE (hashtag, post_id)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

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
        `
            INSERT INTO ${this.tableName}(
              hashtag,
              post_id,
            )
            VALUES (
                '${hashtag}',
                '${postId}'
            )
            ;
            ` +
        "\n"
      );
    }, "");

    await this.datastorePool.query<DBHashtag>(queryString);
  }
}