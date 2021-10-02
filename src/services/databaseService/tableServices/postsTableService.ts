import { Pool, QueryResult } from "pg";
import { UnrenderablePostWithoutElements } from "../../../controllers/post/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBPost {
  post_id: string;
  author_user_id: string;
  caption: string;
  title?: string;
  price?: number;
  scheduled_publication_timestamp: number;
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
        author_user_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        title VARCHAR(128),
        price DECIMAL(12,2),
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
    title,
    price,
    scheduledPublicationTimestamp,
  }: {
    postId: string;
    authorUserId: string;
    caption: string;
    title?: string;
    price?: number;
    scheduledPublicationTimestamp: number;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${this.tableName}(
            post_id,
            author_user_id,
            caption,
            title,
            price,
            scheduled_publication_timestamp
        )
        VALUES (
            '${postId}',
            '${authorUserId}',
            '${caption}',
            '${title}',
            '${price}',
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
  }): Promise<UnrenderablePostWithoutElements[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${PostsTableService.tableName}
        WHERE
          author_user_id = '${creatorUserId}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    return response.rows.map((dbPost) => ({
      postId: dbPost.post_id,
      postAuthorUserId: dbPost.author_user_id,
      caption: dbPost.caption,
      title: dbPost.title,
      price: dbPost.price,
      scheduledPublicationTimestamp: dbPost.scheduled_publication_timestamp,
    }));
  }
}
