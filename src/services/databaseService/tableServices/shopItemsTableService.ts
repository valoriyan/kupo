/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { Controller } from "tsoa";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBShopItem {
  published_item_id: string;
  title: string;
  price: string;
}

export class ShopItemsTableService extends TableService {
  public static readonly tableName = `shop_items`;
  public readonly tableName = ShopItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        published_item_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(64) NOT NULL,
        price DECIMAL(12,2) NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (published_item_id)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createShopItem({
    controller,
    publishedItemId,
    title,
    price,
  }: {
    controller: Controller;
    publishedItemId: string;
    title: string;
    price: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "published_item_id", value: publishedItemId },
            { field: "title", value: title },
            { field: "price", value: price },
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
        additionalErrorInformation: "Error at shopItemsTableService.createShopItem",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getShopItemByPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBShopItem>> {
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

      const response: QueryResult<DBShopItem> = await this.datastorePool.query(query);

      if (response.rows.length < 1) {
        throw new Error("Missing shop item");
      }

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at shopItemsTableService.getShopItemByPublishedItemId",
      });
    }
  }

  public async getShopItemsByPublishedItemIds({
    controller,
    publishedItemIds,
  }: {
    controller: Controller;
    publishedItemIds: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBShopItem[]>> {
    try {
      if (publishedItemIds.length === 0) {
        return Success([]);
      }

      const queryValues: Array<string> = [...publishedItemIds];

      const publishedItemIdsQueryString = publishedItemIds
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_id IN (${publishedItemIdsQueryString})
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBShopItem> = await this.datastorePool.query(query);

      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at shopItemsTableService.getShopItemsByPublishedItemIds",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateShopItemByPublishedItemId({
    controller,
    publishedItemId,
    description,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
  }: {
    controller: Controller;
    publishedItemId: string;
    description?: string;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
    title?: string;
    price?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "description", value: description },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expiration_timestamp", value: expirationTimestamp },
          { field: "title", value: title },
          { field: "price", value: price },
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "published_item_id",
            value: publishedItemId,
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
          "Error at shopItemsTableService.updateShopItemByPublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteShopItem({
    controller,
    publishedItemId,
    authorUserId,
  }: {
    controller: Controller;
    publishedItemId: string;
    authorUserId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "published_item_id", value: publishedItemId },
          { field: "author_user_id", value: authorUserId },
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
        additionalErrorInformation: "Error at shopItemsTableService.deleteShopItem",
      });
    }
  }
}
