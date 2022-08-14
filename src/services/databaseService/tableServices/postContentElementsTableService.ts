/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  FiledMediaElement,
  GenericResponseFailedReason,
} from "../../../controllers/models";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";

interface DBPostContentElement {
  published_item_id: string;
  post_content_element_index: number;
  blob_file_key: string;
  mimetype: string;
}

export class PostContentElementsTableService extends TableService {
  public static readonly tableName = `post_content_elements`;
  public readonly tableName = PostContentElementsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        published_item_id VARCHAR(64) NOT NULL,
        post_content_element_index SMALLINT NOT NULL,
        blob_file_key VARCHAR(64) UNIQUE NOT NULL,
        mimetype VARCHAR(64) NOT NULL,
        UNIQUE (published_item_id, post_content_element_index)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPostContentElements({
    controller,
    postContentElements,
  }: {
    controller: Controller;
    postContentElements: {
      publishedItemId: string;
      postContentElementIndex: number;
      blobFileKey: string;
      mimetype: string;
    }[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const rowsOfFieldsAndValues = postContentElements.map(
        ({
          publishedItemId: publishedItemId,
          postContentElementIndex,
          blobFileKey,
          mimetype,
        }) => [
          { field: "published_item_id", value: publishedItemId },
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postContentElementsTableService.createPostContentElements",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPostContentElementsByPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, FiledMediaElement[]>> {
    try {
      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_id = $1
          ;
        `,
        values: [publishedItemId],
      };

      const response: QueryResult<DBPostContentElement> = await this.datastorePool.query(
        queryString,
      );

      return Success(
        response.rows
          .sort((firstElement, secondElement) =>
            firstElement.post_content_element_index >
            secondElement.post_content_element_index
              ? 1
              : -1,
          )
          .map((dbPostContentElement) => ({
            blobFileKey: dbPostContentElement.blob_file_key,
            mimeType: dbPostContentElement.mimetype,
          })),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postContentElementsTableService.getPostContentElementsByPublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePostContentElementsByPublishedItemId({
    controller,
    publishedItemId: publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      {
        fileKey: string;
      }[]
    >
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "published_item_id", value: publishedItemId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPostContentElement> = await this.datastorePool.query(
        query,
      );

      return Success(
        response.rows.map((dbPostContentElement) => ({
          fileKey: dbPostContentElement.blob_file_key,
        })),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at postContentElementsTableService.deletePostContentElementsByPublishedItemId",
      });
    }
  }
}
