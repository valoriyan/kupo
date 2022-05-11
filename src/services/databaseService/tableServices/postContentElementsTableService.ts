import { Pool, QueryResult } from "pg";
import { FiledMediaElement } from "../../../controllers/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPostContentElement {
  post_id: string;
  post_content_element_index: number;
  blob_file_key: string;
  mimetype: string;
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
        mimetype VARCHAR(64) NOT NULL,
        UNIQUE (post_id, post_content_element_index)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPostContentElements({
    postContentElements,
  }: {
    postContentElements: {
      postId: string;
      postContentElementIndex: number;
      blobFileKey: string;
      mimetype: string;
    }[];
  }): Promise<void> {
    console.log(`${this.tableName} | createPostContentElements`);

    const rowsOfFieldsAndValues = postContentElements.map(
      ({ postId, postContentElementIndex, blobFileKey, mimetype }) => [
        { field: "post_id", value: postId },
        {
          field: "post_content_element_index",
          value: `${postContentElementIndex}`,
        },
        { field: "blob_file_key", value: blobFileKey },
        { field: "mimetype", value: mimetype },
      ],
    );

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues,
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostContentElementsByPostId({
    postId,
  }: {
    postId: string;
  }): Promise<FiledMediaElement[]> {
    const queryString = {
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
        mimeType: dbPostContentElement.mimetype,
      }));
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePostContentElements({ postId }: { postId: string }): Promise<void> {
    // TODO: DECIDE HOW TO HANDLE MEDIA REPLACEMENT
    console.log(postId);
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePostContentElementsByPostId({ postId }: { postId: string }): Promise<
    {
      fileKey: string;
    }[]
  > {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [{ field: "post_id", value: postId }],
      tableName: this.tableName,
    });

    const response: QueryResult<DBPostContentElement> = await this.datastorePool.query(
      query,
    );

    return response.rows.map((dbPostContentElement) => ({
      fileKey: dbPostContentElement.blob_file_key,
    }));
  }
}
