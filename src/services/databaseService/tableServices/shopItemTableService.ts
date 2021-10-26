import { Pool, QueryResult } from "pg";
import { UnrenderableShopItemPreview } from "src/controllers/shopItem/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBShopItem {
  shop_item_id: string;
  author_user_id: string;
  caption: string;
  title: string;
  price: number;
  scheduled_publication_timestamp: number;
  expiration_timestamp?: number;
}

export class ShopItemTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_hashtags`;
  public readonly tableName = ShopItemTableService.tableName;

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
    let columnListString = `
        shop_item_id,
        author_user_id,
        caption,
        title,
        price,
        scheduled_publication_timestamp
    `;
    if (!!expirationTimestamp) {
      columnListString += `, expiration_timestamp`;
    }

    let valuesListString = `
        '${shopItemId}',
        '${authorUserId}',
        '${caption}',
        '${title}',
        '${price}',
        '${scheduledPublicationTimestamp}'
    `;
    if (!!expirationTimestamp) {
      valuesListString += `, '${expirationTimestamp}'`;
    }

    const queryString = `
        INSERT INTO ${this.tableName}(
            ${columnListString}
        )
        VALUES (
            ${valuesListString}
        )
        ;
        `;

    await this.datastorePool.query(queryString);
  }

  public async getShopItemsByCreatorUserId({
    creatorUserId,
  }: {
    creatorUserId: string;
  }): Promise<UnrenderableShopItemPreview[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${ShopItemTableService.tableName}
        WHERE
          author_user_id = '${creatorUserId}'
        ;
      `;

    const response: QueryResult<DBShopItem> = await this.datastorePool.query(queryString);

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
}
