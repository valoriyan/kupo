import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
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
  public static readonly tableName = `${TABLE_NAME_PREFIX}_shop_items`;
  public readonly tableName = ShopItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        published_item_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(64) NOT NULL,
        price DECIMAL(12,2) NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createShopItem({
    publishedItemId,
    title,
    price,
  }: {
    publishedItemId: string;
    title: string;
    price: number;
  }): Promise<void> {
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
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getShopItemByPublishedItemId({
    publishedItemId,
  }: {
    publishedItemId: string;
  }): Promise<DBShopItem> {
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

    return response.rows[0];
  }

  public async getShopItemsByPublishedItemIds({
    publishedItemIds,
  }: {
    publishedItemIds: string[];
  }): Promise<DBShopItem[]> {
    if (publishedItemIds.length === 0) {
      return [];
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

    return response.rows;
  }



  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateShopItemByPublishedItemId({
    publishedItemId,
    description,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
  }: {
    publishedItemId: string;
    description?: string;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
    title?: string;
    price?: number;
  }): Promise<void> {
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
      fieldUsedToIdentifyUpdatedRow: {
        field: "published_item_id",
        value: publishedItemId,
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

  public async deleteShopItem({
    publishedItemId,
    authorUserId,
  }: {
    publishedItemId: string;
    authorUserId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "published_item_id", value: publishedItemId },
        { field: "author_user_id", value: authorUserId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
