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
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { PublishedItemsTableService } from "./publishedItem/publishedItemsTableService";
import { UsersTableService } from "./users/usersTableService";

interface DBSavedItem {
  save_id: string;

  published_item_id: string;

  user_id: string;

  creation_timestamp: string;
}

export class SavedItemsTableService extends TableService {
  public static readonly tableName = `saved_items`;
  public readonly tableName = SavedItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    PublishedItemsTableService.tableName,
    UsersTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        save_id VARCHAR(64) UNIQUE NOT NULL,
        
        published_item_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        
        creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (save_id),

        CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_fkey
          FOREIGN KEY (published_item_id)
          REFERENCES ${PublishedItemsTableService.tableName} (id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)


      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async saveItem({
    controller,
    saveId,
    publishedItemId,
    userId,
    creationTimestamp,
  }: {
    controller: Controller;
    saveId: string;
    publishedItemId: string;
    userId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "save_id", value: saveId },
            { field: "published_item_id", value: publishedItemId },
            { field: "user_id", value: userId },
            { field: "creation_timestamp", value: creationTimestamp },
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
        additionalErrorInformation: "Error at savedItemsTableService.saveItem",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getSavedItemsByUserId({
    controller,
    userId,
    limit,
    getItemsSavedBeforeTimestamp,
  }: {
    controller: Controller;
    userId: string;
    limit?: number;
    getItemsSavedBeforeTimestamp?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBSavedItem[]>> {
    try {
      const queryValues: (string | number)[] = [userId];

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let getItemsSavedBeforeTimestampClause = "";
      if (!!getItemsSavedBeforeTimestamp) {
        getItemsSavedBeforeTimestampClause = `
          AND
            creation_timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(getItemsSavedBeforeTimestamp);
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
          user_id = $1
            ${getItemsSavedBeforeTimestampClause}
          ORDER BY
            creation_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBSavedItem> = await this.datastorePool.query(query);

      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at savedItemsTableService.getSavedItemsByUserId",
      });
    }
  }

  public async doesUserIdSavePublishedItemId({
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
          "Error at savedItemsTableService.doesUserIdSavePublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async unSaveItem({
    controller,
    userId,
    publishedItemId,
  }: {
    controller: Controller;
    userId: string;
    publishedItemId: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "user_id", value: userId },
          { field: "published_item_id", value: publishedItemId },
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
        additionalErrorInformation: "Error at savedItemsTableService.unSaveItem",
      });
    }
  }
}
