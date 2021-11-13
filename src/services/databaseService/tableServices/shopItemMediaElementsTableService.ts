import { Pool, QueryResult } from "pg";
import { ShopItemMediaElement } from "src/controllers/shopItem/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBShopItemMediaElement {
  shop_item_id: string;
  shop_item_element_index: number;
  blob_file_key: string;
}

export class ShopItemMediaElementsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_shop_item_media_elements`;
  public readonly tableName = ShopItemMediaElementsTableService.tableName;

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

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createShopItemMediaElements({
    shopItemMediaElements,
  }: {
    shopItemMediaElements: {
      shopItemId: string;
      shopItemElementIndex: number;
      blobFileKey: string;
    }[];
  }): Promise<void> {
    const query = shopItemMediaElements.reduce((previousValue, currentValue): string => {
      const { shopItemId, shopItemElementIndex, blobFileKey } = currentValue;

      return (
        previousValue +
        generatePSQLGenericCreateRowsQuery<string | number>({
          rowsOfFieldsAndValues: [
            [
              { field: "shop_item_id", value: shopItemId },
              { field: "shop_item_element_index", value: `${shopItemElementIndex}` },
              { field: "blob_file_key", value: blobFileKey },
            ],
          ],
          tableName: this.tableName,
        })
      );
    }, "");

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getShopItemMediaElementsByShopItemId({
    shopItemId,
  }: {
    shopItemId: string;
  }): Promise<ShopItemMediaElement[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          shop_item_id = '$1'
        ;
      `,
      values: [shopItemId],
    };

    const response: QueryResult<DBShopItemMediaElement> = await this.datastorePool.query(
      query,
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

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteShopItemMediaElementsByShopItemId({
    shopItemId,
  }: {
    shopItemId: string;
  }): Promise<
    {
      fileKey: string;
    }[]
  > {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [{ field: "shop_item_id", value: shopItemId }],
      tableName: this.tableName,
    });

    const response: QueryResult<DBShopItemMediaElement> = await this.datastorePool.query(
      query,
    );

    return response.rows.map((dbShopItemMediaElement) => ({
      fileKey: dbShopItemMediaElement.blob_file_key,
    }));
  }
}
