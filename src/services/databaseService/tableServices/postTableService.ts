import { Pool, QueryResult } from "pg";
import { UnrenderablePostWithoutElementsOrHashtags } from "src/controllers/post/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericCreateRowQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities";
import { assertIsNumber } from "./utilities/validations";

interface DBPost {
  post_id: string;
  author_user_id: string;
  caption: string;
  scheduled_publication_timestamp: number;
  expiration_timestamp?: number;
}

function convertDBPostToUnrenderablePostWithoutElementsOrHashtags(
  dbPost: DBPost,
): UnrenderablePostWithoutElementsOrHashtags {
  return {
    postId: dbPost.post_id,
    postAuthorUserId: dbPost.author_user_id,
    caption: dbPost.caption,
    scheduledPublicationTimestamp: dbPost.scheduled_publication_timestamp,
    expirationTimestamp: dbPost.expiration_timestamp,
  };
}

export class PostTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_posts`;
  public readonly tableName = PostTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        post_id VARCHAR(64) UNIQUE NOT NULL,
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
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    postId: string;
    authorUserId: string;
    caption: string;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    const queryString = generatePSQLGenericCreateRowQueryString<string | number>({
      rows: [
        { field: "post_id", value: postId },
        { field: "author_user_id", value: authorUserId },
        { field: "caption", value: caption },
        {
          field: "scheduled_publication_timestamp",
          value: scheduledPublicationTimestamp,
        },
        { field: "expiration_timestamp", value: expirationTimestamp },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(queryString);
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
    const currentTimestamp = Date.now();

    const filteringWhereClause = !!filterOutExpiredAndUnscheduledPosts
      ? `
      AND
        (
          scheduled_publication_timestamp IS NULL
            OR
          scheduled_publication_timestamp < ${currentTimestamp}
        ) 
      AND
        (
            expiration_timestamp IS NULL
          OR
            expiration_timestamp > ${currentTimestamp}
        )
    `
      : "";

    if (filterOutExpiredAndUnscheduledPosts) {
    }

    const queryString = `
        SELECT
          *
        FROM
          ${PostTableService.tableName}
        WHERE
          author_user_id = '${creatorUserId}'
        ${filteringWhereClause}
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

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

    const queryString = `
        SELECT
          *
        FROM
          ${PostTableService.tableName}
        WHERE
            author_user_id = '${creatorUserId}'
          AND
            scheduled_publication_timestamp IS NOT NULL
          AND
            scheduled_publication_timestamp >= '${rangeStartTimestamp}'
          AND
            scheduled_publication_timestamp <= '${rangeEndTimestamp}'
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  public async getPostsByCreatorUserIds({
    creatorUserIds,
  }: {
    creatorUserIds: string[];
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const creatorUserIdsQueryString = creatorUserIds
      .map((creatorUserId) => `'${creatorUserId}'`)
      .join(", ");

    const queryString = `
        SELECT
          *
        FROM
          ${PostTableService.tableName}
        WHERE
          author_user_id IN (${creatorUserIdsQueryString})
        ;
      `;

    console.log("queryString");
    console.log();
    console.log(queryString);

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    return response.rows.map(convertDBPostToUnrenderablePostWithoutElementsOrHashtags);
  }

  public async getPostsByPostIds({
    postIds,
  }: {
    postIds: string[];
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const postIdsQueryString = `(${postIds.map((postId) => `'${postId}'`).join(", ")})`;

    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          postId IN ${postIdsQueryString}
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

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
    const queryString = generatePSQLGenericUpdateRowQueryString<string | number>({
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

    if (queryString) {
      await this.datastorePool.query(queryString);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePost({ postId }: { postId: string }): Promise<void> {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE
        post_id = '${postId}'
      ;
    `;

    await this.datastorePool.query(queryString);
  }
}
