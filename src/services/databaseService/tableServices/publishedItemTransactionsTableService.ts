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
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBPublishedItemTransaction {
  transaction_id: string;
  published_item_id: string;
  non_creator_user_id: string;
  creation_timestamp: string;
}

export class PublishedItemTransactionsTableService extends TableService {
  public static readonly tableName = `published_item_transactions`;
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
            creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey PRIMARY KEY (transaction_id)
        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async recordTransaction({
    controller,
    transactionId,
    publishedItemId,
    nonCreatorUserId,
    creationTimestamp,
  }: {
    controller: Controller;
    transactionId: string;
    publishedItemId: string;
    nonCreatorUserId: string;
    creationTimestamp: number;
    // eslint-disable-next-line @typescript-eslint/ban-types
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
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
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemTransactionsTableService.recordTransaction",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async hasPublishedItemBeenPurchasedByUserId({
    controller,
    publishedItemId,
    nonCreatorUserId,
  }: {
    controller: Controller;
    publishedItemId: string;
    nonCreatorUserId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
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
                  non_creator_user_id = $2
            LIMIT
              1
            ;
          `,
        values: [publishedItemId, nonCreatorUserId],
      };

      const response: QueryResult<DBPublishedItemTransaction> =
        await this.datastorePool.query(query);

      return Success(response.rows.length === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
