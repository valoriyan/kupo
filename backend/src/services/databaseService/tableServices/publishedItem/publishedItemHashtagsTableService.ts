/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { Controller } from "tsoa";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { TableService } from "../models";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { PublishedItemsTableService } from "./publishedItemsTableService";

interface DBHashtag {
  hashtag: string;
  published_item_id: string;
}

export class PublishedItemHashtagsTableService extends TableService {
  public static readonly tableName = `published_item_hashtags`;
  public readonly tableName = PublishedItemHashtagsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [PublishedItemsTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        hashtag VARCHAR(64) NOT NULL,
        published_item_id VARCHAR(64) NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (hashtag, published_item_id),

        CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_fkey
          FOREIGN KEY (published_item_id)
          REFERENCES ${PublishedItemsTableService.tableName} (id)
          ON DELETE CASCADE
          
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async addHashtagsToPublishedItem({
    controller,
    hashtags,
    publishedItemId,
  }: {
    controller: Controller;
    hashtags: string[];
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      if (hashtags.length === 0) {
        return Success({});
      }

      const rowsOfFieldsAndValues = hashtags.map((hashtag) => [
        { field: "hashtag", value: hashtag },
        {
          field: "published_item_id",
          value: `${publishedItemId}`,
        },
      ]);

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues,
        tableName: this.tableName,
      });

      await this.datastorePool.query<DBHashtag>(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.addHashtagsToPublishedItem",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishedItemsWithHashtag({
    controller,
    hashtag,
  }: {
    controller: Controller;
    hashtag: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
              hashtag = $1
          ;
        `,
        values: [hashtag],
      };

      const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

      const publishedItemIds = response.rows.map((row) => row.published_item_id);
      return Success(publishedItemIds);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.getPublishedItemsWithHashtag",
      });
    }
  }

  public async getPublishedItemIdsWithOneOfHashtags({
    controller,
    hashtagSubstring,
  }: {
    controller: Controller;
    hashtagSubstring: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
              hashtag LIKE CONCAT('%', $1::text, '%')
          ;
        `,
        values: [hashtagSubstring],
      };

      const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

      const publishedItemIds = response.rows.map((row) => row.published_item_id);
      return Success(publishedItemIds);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.getPublishedItemIdsWithOneOfHashtags",
      });
    }
  }

  public async getHashtagsForPublishedItemId({
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

      const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

      const hashtags = response.rows.map((row) => row.hashtag);
      return Success(hashtags);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.getHashtagsForPublishedItemId",
      });
    }
  }

  public async getHashtagsCountBySubstring({
    controller,
    hashtagSubstring,
  }: {
    controller: Controller;
    hashtagSubstring: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query: QueryConfig = {
        text: `
          SELECT
            COUNT(DISTINCT hashtag) as count
          FROM
            ${this.tableName}
          WHERE
            hashtag LIKE CONCAT('%', $1::text, '%')
          ;
        `,
        values: [hashtagSubstring],
      };

      const response: QueryResult<{ count: string }> = await this.datastorePool.query(
        query,
      );

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.getHashtagsCountBySubstring",
      });
    }
  }

  public async getHashtagsMatchingSubstring({
    controller,
    hashtagSubstring,
    pageNumber,
    pageSize,
  }: {
    controller: Controller;
    hashtagSubstring: string;
    pageNumber: number;
    pageSize: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const offset = pageSize * pageNumber - pageSize;

      const query: QueryConfig = {
        text: `
          SELECT DISTINCT
            hashtag
          FROM
            ${this.tableName}
          WHERE
            hashtag LIKE CONCAT('%', $1::text, '%')
          LIMIT
            $2
          OFFSET
            $3
          ;
        `,
        values: [hashtagSubstring, pageSize, offset],
      };

      const response: QueryResult<DBHashtag> = await this.datastorePool.query(query);

      const hashtags = response.rows.map((row) => row.hashtag);
      return Success(hashtags);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at hashtagsTableService.getHashtagsMatchingSubstring",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
