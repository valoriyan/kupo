/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { UnrenderablePublishedItemComment } from "../../../controllers/publishedItem/publishedItemComment/models";

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

interface DBPublishedItemComment {
  published_item_comment_id: string;
  published_item_id: string;
  text: string;
  author_user_id: string;
  creation_timestamp: string;
}

function convertDBPublishedItemCommentToUnrenderablePublishedItemComment(
  dbChatMessage: DBPublishedItemComment,
): UnrenderablePublishedItemComment {
  return {
    publishedItemCommentId: dbChatMessage.published_item_comment_id,
    publishedItemId: dbChatMessage.published_item_id,
    text: dbChatMessage.text,
    authorUserId: dbChatMessage.author_user_id,
    creationTimestamp: parseInt(dbChatMessage.creation_timestamp),
  };
}

export class PublishedItemCommentsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_published_item_comments`;
  public readonly tableName = PublishedItemCommentsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        published_item_comment_id VARCHAR(64) UNIQUE NOT NULL,
        published_item_id VARCHAR(64) NOT NULL,
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

  public async createPublishedItemComment({
    controller,
    publishedItemCommentId,
    publishedItemId,
    text,
    authorUserId,
    creationTimestamp,
  }: {
    controller: Controller;
    publishedItemCommentId: string;
    publishedItemId: string;
    text: string;
    authorUserId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "published_item_comment_id", value: publishedItemCommentId },
            { field: "published_item_id", value: publishedItemId },
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
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.createPublishedItemComment",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishedItemCommentById({
    controller,
    publishedItemCommentId,
  }: {
    controller: Controller;
    publishedItemCommentId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishedItemComment>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_comment_id = $1
          ;
        `,
        values: [publishedItemCommentId],
      };

      const response: QueryResult<DBPublishedItemComment> =
        await this.datastorePool.query(query);

      return Success(
        response.rows.map(
          convertDBPublishedItemCommentToUnrenderablePublishedItemComment,
        )[0],
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.getPublishedItemCommentById",
      });
    }
  }

  public async getPublishedItemCommentsByPublishedItemId({
    controller,
    publishedItemId,
    afterTimestamp,
    pageSize,
  }: {
    controller: Controller;
    publishedItemId: string;
    afterTimestamp?: number;
    pageSize: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishedItemComment[]>
  > {
    try {
      const values: Array<string | number> = [publishedItemId, pageSize];

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
            published_item_id = $1
            ${afterTimestampCondition}
          ORDER BY
            creation_timestamp
          LIMIT
            $2
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishedItemComment> =
        await this.datastorePool.query(query);

      return Success(
        response.rows.map(
          convertDBPublishedItemCommentToUnrenderablePublishedItemComment,
        ),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.getPublishedItemCommentsByPublishedItemId",
      });
    }
  }

  public async countCommentsOnPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
            SELECT
              COUNT(*)
            FROM
              ${this.tableName}
            WHERE
              published_item_id = $1
            ;
          `,
        values: [publishedItemId],
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
          "Error at publishedItemCommentsTableService.countCommentsOnPublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updatePublishedItemComment({
    controller,
    publishedItemCommentId,
    text,
  }: {
    controller: Controller;
    publishedItemCommentId: string;
    text: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "text", value: text }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "published_item_comment_id",
            value: publishedItemCommentId,
          },
        ],
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
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.updatePublishedItemComment",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishedItemComment({
    controller,
    publishedItemCommentId,
    authorUserId,
  }: {
    controller: Controller;
    publishedItemCommentId: string;
    authorUserId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderablePublishedItemComment>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "published_item_comment_id", value: publishedItemCommentId },
          { field: "author_user_id", value: authorUserId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishedItemComment> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      if (!!rows.length) {
        const row = response.rows[0];
        return Success(
          convertDBPublishedItemCommentToUnrenderablePublishedItemComment(row),
        );
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error:
          "Post Comment not found at publishedItemCommentsTableService.deletePublishedItemComment",
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.deletePublishedItemComment",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemCommentsTableService.deletePublishedItemComment",
      });
    }
  }
}
