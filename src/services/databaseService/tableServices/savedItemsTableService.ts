import { Pool, QueryResult } from "pg";
import { SavedItemType } from "../../../controllers/userInteraction/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBSavedItem {
  save_id: string;

  item_id: string;

  item_type: SavedItemType;

  user_id: string;

  timestamp: string;
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
        
        item_id VARCHAR(64) NOT NULL,
        item_type VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        
        timestamp BIGINT NOT NULL
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
    itemId,
    itemType,
    userId,
    timestamp,
  }: {
    saveId: string;
    itemId: string;
    itemType: SavedItemType;
    userId: string;
    timestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "save_id", value: saveId },
          { field: "item_id", value: itemId },
          { field: "item_type", value: itemType },
          { field: "user_id", value: userId },
          { field: "timestamp", value: timestamp },
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
          timestamp < $${queryValues.length + 1}
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
          timestamp DESC
        ${limitClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBSavedItem> = await this.datastorePool.query(query);

    return response.rows;
  }

  public async doesUserIdSaveItemId({
    itemId,
    userId,
    itemType,
  }: {
    itemId: string;
    userId: string;
    itemType: string;
  }): Promise<boolean> {
    const query = {
      text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
            item_id = $1
          AND
            user_id = $2
          AND
            item_type = $3
          ;
        `,
      values: [itemId, userId, itemType],
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
    itemType,
    itemId,
  }: {
    userId: string;
    itemType: SavedItemType;
    itemId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "user_id", value: userId },
        { field: "item_type", value: itemType },
        { field: "item_id", value: itemId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}
