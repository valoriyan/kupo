import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPublishedItemTransaction {
  transaction_id: string;
  published_item_id: string;
  non_creator_user_id: string;
  creation_timestamp: string;
}

export class PublishedItemTransactionsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_published_item_transactions`;
  public readonly tableName = PublishedItemTransactionsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
            transaction_id VARCHAR(64) UNIQUE NOT NULL,
            published_item_id VARCHAR(64) NOT NULL,
            non_creator_user_id VARCHAR(64) NOT NULL,
            creation_timestamp BIGINT NOT NULL
        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async recordTransaction({
    transactionId,
    publishedItemId,
    nonCreatorUserId,
    creationTimestamp,
  }: {
    transactionId: string;
    publishedItemId: string;
    nonCreatorUserId: string;
    creationTimestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "transaction_id", value: transactionId },
          { field: "published_item_id", value: publishedItemId },
          { field: "non_creator_user_id", value: nonCreatorUserId },
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

  public async hasPublishedItemBeenPurchasedByUserId({
    publishedItemId,
    nonCreatorUserId,
  }: {
    publishedItemId: string;
    nonCreatorUserId: string;
  }) {
    const query = {
      text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
                published_item_id = $1
            AND
                non_creator_user_id = $2
          LIMIT
            1
          ;
        `,
      values: [publishedItemId, nonCreatorUserId],
    };

    const response: QueryResult<DBPublishedItemTransaction> =
      await this.datastorePool.query(query);

    return response.rows.length === 1;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
