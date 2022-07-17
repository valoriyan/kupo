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
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";

export enum DBShopItemElementType {
  PREVIEW_MEDIA_ELEMENT = "PREVIEW_MEDIA_ELEMENT",
  PURCHASED_MEDIA_ELEMENT = "PURCHASED_MEDIA_ELEMENT",
}

interface DBShopItemMediaElement {
  published_item_id: string;
  shop_item_element_index: number;
  type: DBShopItemElementType;
  blob_file_key: string;
  mimetype: string;
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
        published_item_id VARCHAR(64) NOT NULL,
        shop_item_element_index SMALLINT NOT NULL,
        type VARCHAR(64) NOT NULL,
        blob_file_key VARCHAR(64) UNIQUE NOT NULL,
        mimetype VARCHAR(64) NOT NULL,
        UNIQUE (published_item_id, type, shop_item_element_index)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createShopItemMediaElements({
    controller,
    shopItemMediaElements,
  }: {
    controller: Controller;
    shopItemMediaElements: {
      publishedItemId: string;
      shopItemElementIndex: number;
      shopItemType: DBShopItemElementType;
      blobFileKey: string;
      mimetype: string;
    }[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const rowsOfFieldsAndValues = shopItemMediaElements.map(
        ({
          publishedItemId,
          shopItemElementIndex,
          shopItemType,
          blobFileKey,
          mimetype,
        }) => [
          { field: "published_item_id", value: publishedItemId },
          {
            field: "shop_item_element_index",
            value: `${shopItemElementIndex}`,
          },
          { field: "type", value: shopItemType },
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
          "Error at shopItemMediaElementsTableService.createShopItemMediaElements",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getShopItemMediaElementsByPublishedItemId({
    controller,
    publishedItemId,
    shopItemType,
  }: {
    controller: Controller;
    publishedItemId: string;
    shopItemType: DBShopItemElementType;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, FiledMediaElement[]>> {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            published_item_id = $1
            AND
              type = $2
          ;
        `,
        values: [publishedItemId, shopItemType],
      };

      const response: QueryResult<DBShopItemMediaElement> =
        await this.datastorePool.query(query);

      return Success(
        response.rows
          .sort((firstElement, secondElement) =>
            firstElement.shop_item_element_index > secondElement.shop_item_element_index
              ? 1
              : -1,
          )
          .map((dbShopItemMediaElement) => ({
            blobFileKey: dbShopItemMediaElement.blob_file_key,
            mimeType: dbShopItemMediaElement.mimetype,
          })),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at shopItemMediaElementsTableService.getShopItemMediaElementsByPublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteShopItemMediaElementsByPublishedItemId({
    controller,
    publishedItemId,
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

      const response: QueryResult<DBShopItemMediaElement> =
        await this.datastorePool.query(query);

      return Success(
        response.rows.map((dbShopItemMediaElement) => ({
          fileKey: dbShopItemMediaElement.blob_file_key,
        })),
      );
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at shopItemMediaElementsTableService.deleteShopItemMediaElementsByPublishedItemId",
      });
    }
  }
}
