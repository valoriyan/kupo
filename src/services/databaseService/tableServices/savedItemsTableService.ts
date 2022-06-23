import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBSavedItem {
  save_id: string;

  published_item_id: string;

  user_id: string;

  creation_timestamp: string;
}

export class SavedItemsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_saved_items`;
  public readonly tableName = SavedItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        save_id VARCHAR(64) UNIQUE NOT NULL,
        
        published_item_id VARCHAR(64) NOT NULL,
        item_type VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        
        creation_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async saveItem({
    saveId,
    publishedItemId,
    userId,
    creationTimestamp,
  }: {
    saveId: string;
    publishedItemId: string;
    userId: string;
    creationTimestamp: number;
  }): Promise<void> {
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
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getSavedItemsByUserId({
    userId,
    limit,
    getItemsSavedBeforeTimestamp,
  }: {
    userId: string;
    limit?: number;
    getItemsSavedBeforeTimestamp?: number;
  }): Promise<DBSavedItem[]> {
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

    return response.rows;
  }

  public async doesUserIdSavePublishedItemId({
    publishedItemId,
    userId,
  }: {
    publishedItemId: string;
    userId: string;
  }): Promise<boolean> {
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

    return parseInt(response.rows[0].count) === 1;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async unSaveItem({
    userId,
    publishedItemId,
  }: {
    userId: string;
    publishedItemId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "user_id", value: userId },
        { field: "published_item_id", value: publishedItemId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
