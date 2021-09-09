import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

export interface DBPost {
  post_id: string;
  creator_user_id: string;
  image_id: string;
  caption: string;
  image_blob_filekey: string;
  title: string;
  price: number;
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
        creator_user_id VARCHAR(64) UNIQUE NOT NULL,
        image_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        image_blob_filekey VARCHAR(128) NOT NULL,
        title VARCHAR(128) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  public async createPost({
    postId,
    creatorUserId,
    imageId,
    caption,
    imageBlobFilekey,
    title,
    price,
    scheduledPublicationTimestamp,
  }: {
    postId: string;
    creatorUserId: string;
    imageId: string;
    caption: string;
    imageBlobFilekey: string;
    title: string;
    price: number;
    scheduledPublicationTimestamp: number;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${this.tableName}(
            post_id,
            creator_user_id,
            image_id,
            caption,
            image_blob_filekey,
            title,
            price,
            scheduled_publication_timestamp
        )
        VALUES (
            '${postId}',
            '${creatorUserId}',
            '${imageId}',
            '${caption}',
            '${imageBlobFilekey}',
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
  }): Promise<DBPost[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${PostsTableService.tableName}
        WHERE
          creator_user_id = '${creatorUserId}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<DBPost> = await this.datastorePool.query(queryString);

    const rows = response.rows;
    return rows;
  }
}
