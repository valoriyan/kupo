/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { Controller } from "tsoa";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { TableService } from "../models";
import { generatePSQLGenericDeleteRowsQueryString } from "../utilities";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { PublishedItemsTableService } from "./publishedItemsTableService";

interface DBPublishedItemLike {
  published_item_like_id: string;
  published_item_id: string;
  user_id: string;
  timestamp: string;
}

export class PublishedItemLikesTableService extends TableService {
  public static readonly tableName = `published_item_likes`;
  public readonly tableName = PublishedItemLikesTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [PublishedItemsTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          published_item_like_id VARCHAR(64) UNIQUE NOT NULL,
          published_item_id VARCHAR(64) NOT NULL,
          user_id VARCHAR(64) NOT NULL,
          timestamp BIGINT NOT NULL,

          CONSTRAINT ${this.tableName}_pkey
            PRIMARY KEY (published_item_id, user_id),
          
          CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_fkey
            FOREIGN KEY (published_item_id)
            REFERENCES ${PublishedItemsTableService.tableName} (id)

        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishedItemLikeFromUserId({
    controller,
    publishedItemLikeId,
    publishedItemId,
    userId,
    timestamp,
  }: {
    controller: Controller;
    publishedItemLikeId: string;
    publishedItemId: string;
    userId: string;
    timestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "published_item_like_id", value: publishedItemLikeId },
            { field: "published_item_id", value: publishedItemId },
            { field: "user_id", value: userId },
            { field: "timestamp", value: timestamp },
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
          "Error at publishedItemLikesTableService.createPublishedItemLikeFromUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishedItemLikeByPublishedItemLikeId({
    controller,
    publishedItemLikeId,
  }: {
    controller: Controller;
    publishedItemLikeId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBPublishedItemLike>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_like_id = $1
          LIMIT
            1
          ;
        `,
        values: [publishedItemLikeId],
      };

      const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
        query,
      );

      if (response.rows.length < 1) {
        throw new Error("Missing post like - getPostLikeByPublishedItemLikeId");
      }

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.getPostLikeByPublishedItemLikeId",
      });
    }
  }

  public async getPostLikesByPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBPublishedItemLike[]>> {
    try {
      const query = {
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

      const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
        query,
      );

      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.getPostLikesByPublishedItemId",
      });
    }
  }

  public async getUserIdsLikingPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const query = {
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

      const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
        query,
      );
      const rows = response.rows;

      return Success(rows.map((row) => row.user_id));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.getUserIdsLikingPublishedItemId",
      });
    }
  }

  public async countLikesOnPublishedItemId({
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
          "Error at publishedItemLikesTableService.countLikesOnPublishedItemId",
      });
    }
  }

  public async doesUserIdLikePublishedItemId({
    controller,
    publishedItemId,
    userId,
  }: {
    controller: Controller;
    publishedItemId: string;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
    try {
      const query = {
        text: `
            SELECT
              COUNT(*)
            FROM
              ${this.tableName}
            WHERE
              published_item_id = $1
            AND
              user_id = $2
            ;
          `,
        values: [publishedItemId, userId],
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      return Success(parseInt(response.rows[0].count) === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.doesUserIdLikePublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removePublishedItemLikeByUserId({
    controller,
    publishedItemId,
    userId,
  }: {
    controller: Controller;
    publishedItemId: string;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBPublishedItemLike>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "published_item_id", value: publishedItemId },
          { field: "user_id", value: userId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
        query,
      );

      if (response.rows.length < 1) {
        throw new Error("Missing post like - none to delete");
      }

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.removePublishedItemLikeByUserId",
      });
    }
  }

  public async removeAllPostLikesByPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBPublishedItemLike>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "published_item_id", value: publishedItemId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishedItemLike> = await this.datastorePool.query(
        query,
      );

      if (response.rows.length < 1) {
        return Failure({
          controller,
          httpStatusCode: 500,
          reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
          error:
            "Missing post like - none to delete in publishedItemLikesTableService.removeAllPostLikesByPublishedItemId",
          additionalErrorInformation:
            "Error at publishedItemLikesTableService.removeAllPostLikesByPublishedItemId",
        });
      }

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemLikesTableService.removeAllPostLikesByPublishedItemId",
      });
    }
  }
}
