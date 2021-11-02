import { Pool, QueryResult } from "pg";
import { UnrenderablePostWithoutElementsOrHashtags } from "../../../controllers/post/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBPost {
  post_id: string;
  author_user_id: string;
  caption: string;
  scheduled_publication_timestamp: number;
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
        author_user_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  public async createPost({
    postId,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
  }: {
    postId: string;
    authorUserId: string;
    caption: string;
    scheduledPublicationTimestamp: number;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${this.tableName}(
            post_id,
            author_user_id,
            caption,
            scheduled_publication_timestamp
        )
        VALUES (
            '${postId}',
            '${authorUserId}',
            '${caption}',
            '${scheduledPublicationTimestamp}'
        )
        ;
        `;

    await this.datastorePool.query(queryString);
  }

  public async getPostsByCreatorUserId({
    creatorUserId,
  }: {
    creatorUserId: string;
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${PostTableService.tableName}
        WHERE
          author_user_id = '${creatorUserId}'
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    return response.rows.map(
      (dbPost): UnrenderablePostWithoutElementsOrHashtags => ({
        postId: dbPost.post_id,
        postAuthorUserId: dbPost.author_user_id,
        caption: dbPost.caption,
        scheduledPublicationTimestamp: dbPost.scheduled_publication_timestamp,
      }),
    );
  }

  public async getPostsByCreatorUserIds({
    creatorUserIds,
  }: {
    creatorUserIds: string[];
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const creatorUserIdsQueryString = `(${creatorUserIds.join(", ")})`;

    const queryString = `
        SELECT
          *
        FROM
          ${PostTableService.tableName}
        WHERE
          author_user_id IN ${creatorUserIdsQueryString}
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    return response.rows.map(
      (dbPost): UnrenderablePostWithoutElementsOrHashtags => ({
        postId: dbPost.post_id,
        postAuthorUserId: dbPost.author_user_id,
        caption: dbPost.caption,
        scheduledPublicationTimestamp: dbPost.scheduled_publication_timestamp,
      }),
    );
  }

  public async getPostsByPostIds({
    postIds,
  }: {
    postIds: string[];
  }): Promise<UnrenderablePostWithoutElementsOrHashtags[]> {
    const postIdsQueryString = `(${postIds.map(postId => `'${postId}'`).join(", ")})`;

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

    return response.rows.map(
      (dbPost): UnrenderablePostWithoutElementsOrHashtags => ({
        postId: dbPost.post_id,
        postAuthorUserId: dbPost.author_user_id,
        caption: dbPost.caption,
        scheduledPublicationTimestamp: dbPost.scheduled_publication_timestamp,
      }),
    );
  }


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
