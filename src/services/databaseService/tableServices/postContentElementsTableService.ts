import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBPostContentElement {
  post_id: string;
  post_content_element_index: number;
  blob_file_key: string;
}

export class PostContentElementsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_post_content_elements`;
  public readonly tableName = PostContentElementsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        post_id VARCHAR(64) NOT NULL,
        post_content_element_index SMALLINT NOT NULL,
        blob_file_key VARCHAR(64) UNIQUE NOT NULL,
        UNIQUE (post_id, post_content_element_index)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  public async createPostContentElements({
    postContentElements,
  }: {
    postContentElements: {
      postId: string;
      postContentElementIndex: number;
      blobFileKey: string;
    }[];
  }): Promise<void> {
    const queryString = postContentElements.reduce(
      (previousValue, currentValue): string => {
        return (
          previousValue +
          `
            INSERT INTO ${this.tableName}(
              post_id,
              post_content_element_index,
              blob_file_key
            )
            VALUES (
                '${currentValue.postId}',
                '${currentValue.postContentElementIndex}',
                '${currentValue.blobFileKey}'
            )
            ;
            ` +
          "\n"
        );
      },
      "",
    );

    await this.datastorePool.query(queryString);
  }

  public async getPostContentElementsByPostId({
    postId,
  }: {
    postId: string;
  }): Promise<{
    blobFileKey: string;
  }[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${PostContentElementsTableService.tableName}
        WHERE
        post_id = '${postId}'
        ;
      `;

    const response: QueryResult<DBPostContentElement> = await this.datastorePool.query(
      queryString,
    );

    return response.rows
      .sort((firstElement, secondElement) =>
        firstElement.post_content_element_index > secondElement.post_content_element_index
          ? 1
          : -1,
      )
      .map((dbPostContentElement) => ({
        blobFileKey: dbPostContentElement.blob_file_key,
      }));
  }

  public async deleteContentElementsByPostId({
    postId,
  }: {
    postId: string;
  }): Promise<void> {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE
        post_id = '${postId}'
      ;
    `;

    await this.datastorePool.query(queryString);
  }
}
