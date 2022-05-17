import { Pool, QueryResult } from "pg";
import { UnrenderableShopItemPreview } from "../../../controllers/shopItem/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBShopItem {
  shop_item_id: string;
  author_user_id: string;
  description: string;
  creation_timestamp: string;
  scheduled_publication_timestamp: string;
  expiration_timestamp?: string;
  title: string;
  price: string;
}

function convertDBShopItemToUnrenderableShopItemPreview(
  dbShopItem: DBShopItem,
): UnrenderableShopItemPreview {
  return {
    shopItemId: dbShopItem.shop_item_id,
    authorUserId: dbShopItem.author_user_id,
    description: dbShopItem.description,
    creationTimestamp: parseInt(dbShopItem.creation_timestamp),
    scheduledPublicationTimestamp: parseInt(dbShopItem.scheduled_publication_timestamp),
    expirationTimestamp: !!dbShopItem.expiration_timestamp
      ? parseInt(dbShopItem.expiration_timestamp)
      : undefined,
    title: dbShopItem.title,
    price: parseFloat(dbShopItem.price),
  };
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
        shop_item_id VARCHAR(64) UNIQUE NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        description VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL,
        expiration_timestamp BIGINT,
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
    shopItemId,
    authorUserId,
    description,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
  }: {
    shopItemId: string;
    authorUserId: string;
    description: string;
    creationTimestamp: number;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
    title: string;
    price: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "shop_item_id", value: shopItemId },
          { field: "author_user_id", value: authorUserId },
          { field: "description", value: description },
          { field: "creation_timestamp", value: creationTimestamp },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expiration_timestamp", value: expirationTimestamp },
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

  public async getShopItemByShopItemId({
    shopItemId,
  }: {
    shopItemId: string;
  }): Promise<UnrenderableShopItemPreview> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          shop_item_id = $1
        ;
      `,
      values: [shopItemId],
    };

    const response: QueryResult<DBShopItem> = await this.datastorePool.query(query);

    if (response.rows.length < 1) {
      throw new Error("Missing shop item");
    }

    return convertDBShopItemToUnrenderableShopItemPreview(response.rows[0]);
  }


  public async getShopItemsByCreatorUserId({
    creatorUserId,
    filterOutExpiredAndUnscheduledShopItems,
    limit,
    getShopItemsBeforeTimestamp,
  }: {
    creatorUserId: string;
    filterOutExpiredAndUnscheduledShopItems: boolean;
    limit?: number;
    getShopItemsBeforeTimestamp?: number;
  }): Promise<UnrenderableShopItemPreview[]> {
    const queryValues: (string | number)[] = [creatorUserId];
    const currentTimestamp = Date.now();

    let filteringWhereClause = "";
    if (!!filterOutExpiredAndUnscheduledShopItems) {
      filteringWhereClause = `
        AND
          (
            scheduled_publication_timestamp IS NULL
              OR
            scheduled_publication_timestamp < $${queryValues.length + 1}
          ) 
        AND
          (
              expiration_timestamp IS NULL
            OR
              expiration_timestamp > $${queryValues.length + 2}
          )
      `;

      queryValues.push(currentTimestamp);
      queryValues.push(currentTimestamp);
    }

    let limitClause = "";
    if (!!limit) {
      limitClause = `
        LIMIT $${queryValues.length + 1}
      `;

      queryValues.push(limit);
    }

    let getPostsBeforeTimestampClause = "";
    if (!!getShopItemsBeforeTimestamp) {
      getPostsBeforeTimestampClause = `
        AND
          scheduled_publication_timestamp < $${queryValues.length + 1}
      `;

      queryValues.push(getShopItemsBeforeTimestamp);
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id = $1
          ${filteringWhereClause}
          ${getPostsBeforeTimestampClause}
        ORDER BY
          scheduled_publication_timestamp DESC
        ${limitClause}

        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBShopItem> = await this.datastorePool.query(query);

    return response.rows.map(convertDBShopItemToUnrenderableShopItemPreview);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateShopItemByShopItemId({
    shopItemId,
    description,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
  }: {
    shopItemId: string;
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
        field: "shop_item_id",
        value: shopItemId,
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
    shopItemId,
    authorUserId,
  }: {
    shopItemId: string;
    authorUserId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "shop_item_id", value: shopItemId },
        { field: "author_user_id", value: authorUserId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
