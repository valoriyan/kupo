import { Pool, QueryResult } from "pg";
import { ShopItemMediaElement } from "src/controllers/shopItem/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

interface DBShopItemMediaElement {
  shop_item_id: string;
  shop_item_element_index: number;
  blob_file_key: string;
}

export class ShopItemMediaElementTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_post_content_elements`;
  public readonly tableName = ShopItemMediaElementTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        shop_item_id VARCHAR(64) NOT NULL,
        shop_item_element_index SMALLINT NOT NULL,
        blob_file_key VARCHAR(64) UNIQUE NOT NULL,
        UNIQUE (shop_item_id, shop_item_element_index)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  public async createShopItemMediaElements({
    shopItemMediaElements,
  }: {
    shopItemMediaElements: {
      shopItemId: string;
      shopItemElementIndex: number;
      blobFileKey: string;
    }[];
  }): Promise<void> {
    const queryString = shopItemMediaElements.reduce(
      (previousValue, currentValue): string => {
        return (
          previousValue +
          `
            INSERT INTO ${this.tableName}(
              shop_item_id,
              shop_item_element_index,
              blob_file_key
            )
            VALUES (
                '${currentValue.shopItemId}',
                '${currentValue.shopItemElementIndex}',
                '${currentValue.blobFileKey}'
            )
            ;
            ` +
          "\n"
        );
      },
      "",
    );

    await this.datastorePool.query(queryString);
  }

  public async getShopItemMediaElementsByShopItemId({
    shopItemId,
  }: {
    shopItemId: string;
  }): Promise<ShopItemMediaElement[]> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          shop_item_id = '${shopItemId}'
        ;
      `;

    const response: QueryResult<DBShopItemMediaElement> = await this.datastorePool.query(
      queryString,
    );

    return response.rows
      .sort((firstElement, secondElement) =>
        firstElement.shop_item_element_index > secondElement.shop_item_element_index
          ? 1
          : -1,
      )
      .map((dbShopItemMediaElement) => ({
        blobFileKey: dbShopItemMediaElement.blob_file_key,
      }));
  }
}
