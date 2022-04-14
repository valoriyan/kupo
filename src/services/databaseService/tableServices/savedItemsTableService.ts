import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBSavedItem {
  save_id: string;

  item_id: string;

  // "post" | "shop_item"
  item_type: string;

  user_id: string;

  timestamp: string;
}


export class SavedItemsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_posts`;
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

  public async createPost({
    saveId,
    itemId,
    itemType,
    userId,
    timestamp,
  }: {
    saveId: string;
    itemId: string;
    itemType: string;
    userId: string;
    timestamp: number;
  }): Promise<void> {
    console.log(`${this.tableName} | createPost`);

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
          scheduled_publication_timestamp < $${queryValues.length + 1}
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
          author_user_id = $1
          ${getItemsSavedBeforeTimestampClause}
        ORDER BY
          scheduled_publication_timestamp DESC
        ${limitClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBSavedItem> = await this.datastorePool.query(query);

    return response.rows;
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
    itemType: string;
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
