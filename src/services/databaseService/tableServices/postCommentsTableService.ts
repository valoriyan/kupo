/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { UnrenderablePostComment } from "../../../controllers/publishedItem/publishedItemComment/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";

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
    controller,
    postCommentId,
    postId,
    text,
    authorUserId,
    creationTimestamp,
  }: {
    controller: Controller;
    postCommentId: string;
    postId: string;
    text: string;
    authorUserId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at postCommentsTableService.createPostComment",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostCommentById({
    controller,
    postCommentId,
  }: {
    controller: Controller;
    postCommentId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePostComment>
  > {
    try {
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

      return Success(response.rows.map(convertDBPostCommentToUnrenderablePostComment)[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postCommentsTableService.getPostCommentById",
      });
    }
  }

  public async getPostCommentsByPostId({
    controller,
    postId,
    afterTimestamp,
    pageSize,
  }: {
    controller: Controller;
    postId: string;
    afterTimestamp?: number;
    pageSize: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePostComment[]>
  > {
    try {
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

      return Success(response.rows.map(convertDBPostCommentToUnrenderablePostComment));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postCommentsTableService.getPostCommentsByPostId",
      });
    }
  }

  public async countCommentsOnPostId({
    controller,
    postId,
  }: {
    controller: Controller;
    postId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
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

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postCommentsTableService.countCommentsOnPostId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePostComment({
    controller,
    postCommentId,
    text,
  }: {
    controller: Controller;
    postCommentId: string;
    text: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at postCommentsTableService.updatePostComment",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePostComment({
    controller,
    postCommentId,
    authorUserId,
  }: {
    controller: Controller;
    postCommentId: string;
    authorUserId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePostComment>
  > {
    try {
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
        return Success(convertDBPostCommentToUnrenderablePostComment(row));
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "Post Comment not found at postCommentsTableService.deletePostComment",
        additionalErrorInformation: "Error at postCommentsTableService.deletePostComment",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at postCommentsTableService.deletePostComment",
      });
    }
  }
}
