import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBUserHashtag {
  user_id: string;
  hashtag_1: string;
  hashtag_2: string;
  hashtag_3: string;
  hashtag_4: string;
  hashtag_5: string;
}

export class UserHashtagsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_user_hashtags`;
  public readonly tableName = UserHashtagsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_id VARCHAR(64) UNIQUE NOT NULL,
        hashtag_1 VARCHAR(64),
        hashtag_2 VARCHAR(64),
        hashtag_3 VARCHAR(64),
        hashtag_4 VARCHAR(64),
        hashtag_5 VARCHAR(64)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async upsertHashtagsForUser({
    userId,
    hashtag1,
    hashtag2,
    hashtag3,
    hashtag4,
    hashtag5,
  }: {
    userId: string;
    hashtag1: string;
    hashtag2: string;
    hashtag3: string;
    hashtag4: string;
    hashtag5: string;
  }): Promise<void> {
    console.log(`${this.tableName} | addHashtagsToUser`);

    const queryText = `
      INSERT INTO ${this.tableName} (
        user_id,
        hashtag_1,
        hashtag_2,
        hashtag_3,
        hashtag_4,
        hashtag_5
      )
      VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      ON CONFLICT(user_id)
      DO
        UPDATE
        SET
          hashtag_1 = $2,
          hashtag_2 = $3,
          hashtag_3 = $4,
          hashtag_4 = $5,
          hashtag_5 = $6
      ;
    `;

    const query = {
      text: queryText,
      values: [userId, hashtag1, hashtag2, hashtag3, hashtag4, hashtag5],
    };

    await this.datastorePool.query<DBUserHashtag>(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserIdsWithHashtag({
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
            hashtag_1 = $1
          OR
            hashtag_2 = $2
          OR
            hashtag_3 = $3
          OR
            hashtag_4 = $4
          OR
            hashtag_5 = $5
        ;
      `,
      values: [hashtag],
    };

    const response: QueryResult<DBUserHashtag> = await this.datastorePool.query(query);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId = response.rows.map((row) => row.user_id!);
    return userId;
  }

  public async getHashtagsForUserId({ userId }: { userId: string }): Promise<string[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          user_id = $1
        ;
      `,
      values: [userId],
    };

    const response: QueryResult<DBUserHashtag> = await this.datastorePool.query(query);

    if (response.rows.length < 1) {
      return [];
    }

    const row = response.rows[0];
    const hashtags = [
      row.hashtag_1,
      row.hashtag_2,
      row.hashtag_3,
      row.hashtag_4,
      row.hashtag_5,
    ];
    return hashtags;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
