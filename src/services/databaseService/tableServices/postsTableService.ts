import { Pool, QueryResult } from "pg";
import { UnrenderablePostWithoutElementsOrHashtags } from "src/controllers/post/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { assertIsNumber } from "./utilities/validations";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPost {
  post_id: string;
  author_user_id: string;
  caption: string;
  creation_timestamp: string;
  scheduled_publication_timestamp: string;
  expiration_timestamp?: string;
}

function convertDBPostToUnrenderablePostWithoutElementsOrHashtags(
  dbPost: DBPost,
): UnrenderablePostWithoutElementsOrHashtags {
  return {
    postId: dbPost.post_id,
    authorUserId: dbPost.author_user_id,
    caption: dbPost.caption,
    creationTimestamp: parseInt(dbPost.creation_timestamp),
    scheduledPublicationTimestamp: parseInt(dbPost.scheduled_publication_timestamp),
    expirationTimestamp: !!dbPost.expiration_timestamp
      ? parseInt(dbPost.expiration_timestamp)
      : undefined,
  };
}

export class PostsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_posts`;
  public readonly tableName = PostsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        post_id VARCHAR(64) UNIQUE NOT NULL,
        creation_timestamp BIGINT,
        author_user_id VARCHAR(64) NOT NULL,
        caption VARCHAR(256) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL,
        expiration_timestamp BIGINT
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPost({
    postId,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    postId: string;
    creationTimestamp: number;
    authorUserId: string;
    caption: string;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    console.log(`${this.tableName} | createPost`);

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "post_id", value: postId },
          { field: "creation_timestamp", value: creationTimestamp },
          { field: "author_user_id", value: authorUserId },
          { field: "caption", value: caption },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expiration_timestamp", value: expirationTimestamp },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostsByCreatorUserId({
    creatorUserId,
    filterOutExpiredAndUnscheduledPosts,
  }: {
    creatorUserId: string;
    filterOutExpiredAndUnscheduledPosts: boolean;
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const queryValues: (string | number)[] = [creatorUserId];

    const currentTimestamp = Date.now();

    let filteringWhereClause = "";
    if (!!filterOutExpiredAndUnscheduledPosts) {
      queryValues.push(currentTimestamp);
      queryValues.push(currentTimestamp);

      filteringWhereClause = `
        AND
          (
            scheduled_publication_timestamp IS NULL
              OR
            scheduled_publication_timestamp < $2
          ) 
        AND
          (
              expiration_timestamp IS NULL
            OR
              expiration_timestamp > $3
          )
      `;
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id = $1
        ${filteringWhereClause}
        ORDER BY
          scheduled_publication_timestamp DESC    
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPost> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  public async getPostsWithScheduledPublicationTimestampWithinRangeByCreatorUserId({
    creatorUserId,
    rangeEndTimestamp,
    rangeStartTimestamp,
  }: {
    creatorUserId: string;
    rangeEndTimestamp: number;
    rangeStartTimestamp: number;
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    assertIsNumber(rangeEndTimestamp);
    assertIsNumber(rangeStartTimestamp);

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            author_user_id = $1
          AND
            scheduled_publication_timestamp IS NOT NULL
          AND
            scheduled_publication_timestamp >= $2
          AND
            scheduled_publication_timestamp <= $3
        ;
      `,
      values: [creatorUserId, rangeStartTimestamp, rangeEndTimestamp],
    };

    const response: QueryResult<DBPost> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  public async getPostsByCreatorUserIds({
    creatorUserIds,
    count,
  }: {
    creatorUserIds: string[];
    count?: number;
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    if (creatorUserIds.length === 0) {
      return [];
    }

    const creatorUserIdsQueryString = creatorUserIds
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const limitQueryClause = !!count ? `LIMIT ${count}` : "";

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id IN (${creatorUserIdsQueryString})
        ORDER BY
          scheduled_publication_timestamp DESC
        ${limitQueryClause}
        ;
      `,
      values: creatorUserIds,
    };

    const response: QueryResult<DBPost> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  public async getPostsByPostIds({
    postIds,
  }: {
    postIds: string[];
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    if (postIds.length === 0) {
      return [];
    }

    const postIdsQueryString = `( ${postIds
      .map((_, index) => `$${index + 1}`)
      .join(", ")} )`;

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          post_id IN ${postIdsQueryString}
        ORDER BY
          scheduled_publication_timestamp DESC
        ;
      `,
      values: postIds,
    };

    const response: QueryResult<DBPost> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePost({
    postId,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    postId: string;
    authorUserId?: string;
    caption?: string;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [
        { field: "author_user_id", value: authorUserId },
        { field: "caption", value: caption },
        {
          field: "scheduled_publication_timestamp",
          value: scheduledPublicationTimestamp,
        },
        { field: "expirationTimestamp", value: expirationTimestamp },
      ],
      fieldUsedToIdentifyUpdatedRow: {
        field: "post_id",
        value: postId,
      },
      tableName: this.tableName,
    });

    if (!isQueryEmpty({ query })) {
      await this.datastorePool.query(query);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePost({ postId }: { postId: string }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [{ field: "post_id", value: postId }],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
