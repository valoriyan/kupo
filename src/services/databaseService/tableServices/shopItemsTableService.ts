import { Pool, QueryResult } from "pg";
import { UnrenderableShopItemPreview } from "src/controllers/shopItem/models";
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
  caption: string;
  title: string;
  price: number;
  scheduled_publication_timestamp: number;
  expiration_timestamp?: number;
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
        caption VARCHAR(64) NOT NULL,
        title VARCHAR(64) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL,
        expiration_timestamp BIGINT
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
    caption,
    title,
    price,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    shopItemId: string;
    authorUserId: string;
    caption: string;
    title: string;
    price: number;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "shop_item_id", value: shopItemId },
          { field: "author_user_id", value: authorUserId },
          { field: "caption", value: caption },
          { field: "title", value: title },
          { field: "price", value: price },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expiration_timestamp", value: expirationTimestamp },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getShopItemsByCreatorUserId({
    creatorUserId,
  }: {
    creatorUserId: string;
  }): Promise<UnrenderableShopItemPreview[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id = $1
        ;
      `,
      values: [creatorUserId],
    };

    const response: QueryResult<DBShopItem> = await this.datastorePool.query(query);

    return response.rows.map(
      (dbShopItem): UnrenderableShopItemPreview => ({
        numberOfElements: 0,

        id: dbShopItem.shop_item_id,
        authorUserId: dbShopItem.author_user_id,
        caption: dbShopItem.caption,
        title: dbShopItem.title,
        price: dbShopItem.price,
        scheduledPublicationTimestamp: dbShopItem.scheduled_publication_timestamp,
        expirationTimestamp: dbShopItem.expiration_timestamp,

        countSold: 0,

        hashtags: [],
        collaboratorUserIds: [],

        likesCount: 0,
        tipsSum: 0,
      }),
    );
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateShopItemByShopItemId({
    shopItemId,
    caption,
    title,
    price,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    shopItemId: string;
    caption?: string;
    title?: string;
    price?: number;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [
        { field: "caption", value: caption },
        { field: "title", value: title },
        { field: "price", value: price },
        {
          field: "scheduled_publication_timestamp",
          value: scheduledPublicationTimestamp,
        },
        { field: "expiration_timestamp", value: expirationTimestamp },
      ],
      fieldUsedToIdentifyUpdatedRow: {
        field: "shop_item_id",
        value: shopItemId,
      },
      tableName: this.tableName,
    });

    console.log(query.text);
    console.log(query.values);

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
