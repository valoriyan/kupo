import { Pool, QueryResult } from "pg";
import { CreditCardSummary } from "../../../controllers/publishedItem/shopItem/payments/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBStoredCreditCardDatum {
  local_credit_card_id: string;

  user_id: string;
  credit_card_last_four_digits: string;
  payment_processor_card_id: string;
  creation_timestamp: string;
}

function convertDBStoredCreditCardDatumToCreditCardSummary(
  dBStoredCreditCardDatum: DBStoredCreditCardDatum,
): CreditCardSummary {
  return {
    localCreditCardId: dBStoredCreditCardDatum.local_credit_card_id,
    userId: dBStoredCreditCardDatum.user_id,
    creditCardLastFourDigits: dBStoredCreditCardDatum.credit_card_last_four_digits,
    creationTimestamp: parseInt(dBStoredCreditCardDatum.creation_timestamp),
  };
}

export class StoredCreditCardDataTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_stored_credit_card_data`;
  public readonly tableName = StoredCreditCardDataTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          local_credit_card_id VARCHAR(64) NOT NULL,

          user_id VARCHAR(64) NOT NULL,
          

          credit_card_last_four_digits VARCHAR(4) NOT NULL,

          payment_processor_card_id VARCHAR(64) UNIQUE NOT NULL,

          creation_timestamp BIGINT NOT NULL

          PRIMARY KEY (user_id, payment_processor_card_id)
        )
        ;
      `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async storeUserCreditCardData({
    userId,
    localCreditCardId,
    creditCardLastFourDigits,
    paymentProcessorCustomerId,
    paymentProcessorCardId,
    creationTimestamp,
  }: {
    userId: string;
    localCreditCardId: string;
    creditCardLastFourDigits: string;
    paymentProcessorCustomerId: string;
    paymentProcessorCardId: string;
    creationTimestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "user_id", value: userId },
          { field: "local_credit_card_id", value: localCreditCardId },
          { field: "credit_card_last_four_digits", value: creditCardLastFourDigits },
          { field: "payment_processor_customer_id", value: paymentProcessorCustomerId },
          { field: "payment_processor_card_id", value: paymentProcessorCardId },
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

  public async getStoredCreditCardByLocalId({
    localCreditCardId,
  }: {
    localCreditCardId: string;
  }): Promise<DBStoredCreditCardDatum> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
        local_credit_card_id = $1
        ;
      `,
      values: [localCreditCardId],
    };

    const response: QueryResult<DBStoredCreditCardDatum> = await this.datastorePool.query(
      query,
    );

    return response.rows[0];
  }

  public async getCreditCardsStoredByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<CreditCardSummary[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            user_id = $1
        ;
      `,
      values: [userId],
    };

    const response: QueryResult<DBStoredCreditCardDatum> = await this.datastorePool.query(
      query,
    );

    return response.rows.map(convertDBStoredCreditCardDatumToCreditCardSummary);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async unstoreCreditCard({
    userId,
    localCreditCardId,
  }: {
    userId: string;
    localCreditCardId: string;
  }): Promise<DBStoredCreditCardDatum> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "user_id", value: userId },
        { field: "local_credit_card_id", value: localCreditCardId },
      ],
      tableName: this.tableName,
    });

    const response: QueryResult<DBStoredCreditCardDatum> = await this.datastorePool.query(
      query,
    );

    if (response.rows.length < 1) {
      throw new Error("Missing cached credit card - none to delete");
    }

    return response.rows[0];
  }
}
