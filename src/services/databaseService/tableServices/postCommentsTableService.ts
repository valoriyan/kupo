import { Pool, QueryResult } from "pg";
import { UnrenderablePostComment } from "../../../controllers/postComment/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPostComment {
  post_comment_id: string;
  post_id: string;
  text: string;
  author_user_id: string;
  creation_timestamp: string;
}

function convertDBPostCommentToUnrenderablePostComment(
  dbChatMessage: DBPostComment,
): UnrenderablePostComment {
  return {
    postCommentId: dbChatMessage.post_comment_id,
    postId: dbChatMessage.post_id,
    text: dbChatMessage.text,
    authorUserId: dbChatMessage.author_user_id,
    creationTimestamp: parseInt(dbChatMessage.creation_timestamp),
  };
}

export class PostCommentsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_post_comments`;
  public readonly tableName = PostCommentsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        post_comment_id VARCHAR(64) UNIQUE NOT NULL,
        post_id VARCHAR(64) NOT NULL,
        text VARCHAR(300) NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPostComment({
    postCommentId,
    postId,
    text,
    authorUserId,
    creationTimestamp,
  }: {
    postCommentId: string;
    postId: string;
    text: string;
    authorUserId: string;
    creationTimestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "post_comment_id", value: postCommentId },
          { field: "post_id", value: postId },
          { field: "text", value: text },
          { field: "author_user_id", value: authorUserId },
          { field: "creation_timestamp", value: creationTimestamp },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostCommentById({
    postCommentId,
  }: {
    postCommentId: string;
  }): Promise<UnrenderablePostComment> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          post_comment_id = $1
        ;
      `,
      values: [postCommentId],
    };

    const response: QueryResult<DBPostComment> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostCommentToUnrenderablePostComment)[0];
  }

  public async getPostCommentsByPostId({
    postId,
    afterTimestamp,
    pageSize,
  }: {
    postId: string;
    afterTimestamp?: number;
    pageSize: number;
  }): Promise<UnrenderablePostComment[]> {
    const values: Array<string | number> = [postId, pageSize];

    let afterTimestampCondition = "";
    if (!!afterTimestamp) {
      afterTimestampCondition = `AND creation_timestamp > $3`;
      values.push(afterTimestamp);
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          post_id = $1
          ${afterTimestampCondition}
        ORDER BY
          creation_timestamp
        LIMIT
          $2
        ;
      `,
      values,
    };

    const response: QueryResult<DBPostComment> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPostCommentToUnrenderablePostComment);
  }

  public async countCommentsOnPostId({ postId }: { postId: string }): Promise<number> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            post_id = $1
          ;
        `,
      values: [postId],
    };

    const response: QueryResult<{
      count: string;
    }> = await this.datastorePool.query(query);

    return parseInt(response.rows[0].count);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePostComment({
    postCommentId,
    text,
  }: {
    postCommentId: string;
    text: string;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "text", value: text }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "post_comment_id",
        value: postCommentId,
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

  public async deletePostComment({
    postCommentId,
    authorUserId,
  }: {
    postCommentId: string;
    authorUserId: string;
  }): Promise<UnrenderablePostComment> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "post_comment_id", value: postCommentId },
        { field: "author_user_id", value: authorUserId },
      ],
      tableName: this.tableName,
    });

    const response: QueryResult<DBPostComment> = await this.datastorePool.query(query);

    const rows = response.rows;

    if (!!rows.length) {
      const row = response.rows[0];
      return convertDBPostCommentToUnrenderablePostComment(row);
    }

    throw new Error("No rows deleted");
  }
}
