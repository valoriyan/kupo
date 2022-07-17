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
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

export interface DBStoredCreditCardDatum {
  local_credit_card_id: string;
  user_id: string;
  payment_processor_card_id: string;
  is_primary_card: boolean;
  creation_timestamp: string;
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

          payment_processor_card_id VARCHAR(64) UNIQUE NOT NULL,

          is_primary_card boolean NOT NULL,

          creation_timestamp BIGINT NOT NULL,

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
    controller,
    userId,
    localCreditCardId,
    paymentProcessorCardId,
    creationTimestamp,
    isPrimaryCard,
  }: {
    controller: Controller;
    userId: string;
    localCreditCardId: string;
    paymentProcessorCardId: string;
    creationTimestamp: number;
    isPrimaryCard: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number | boolean>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_id", value: userId },
            { field: "local_credit_card_id", value: localCreditCardId },
            { field: "payment_processor_card_id", value: paymentProcessorCardId },
            { field: "is_primary_card", value: isPrimaryCard },
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
          "Error at storedCreditCardDataTableService.storeUserCreditCardData",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getStoredCreditCardByLocalId({
    controller,
    localCreditCardId,
  }: {
    controller: Controller;
    localCreditCardId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBStoredCreditCardDatum>
  > {
    try {
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

      const response: QueryResult<DBStoredCreditCardDatum> =
        await this.datastorePool.query(query);

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at storedCreditCardDataTableService.getStoredCreditCardByLocalId",
      });
    }
  }

  public async getCreditCardsStoredByUserId({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBStoredCreditCardDatum[]>
  > {
    try {
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

      const response: QueryResult<DBStoredCreditCardDatum> =
        await this.datastorePool.query(query);

      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at storedCreditCardDataTableService.getCreditCardsStoredByUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async makeCreditCardPrimary({
    controller,
    userId,
    localCreditCardId,
  }: {
    controller: Controller;
    userId: string;
    localCreditCardId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const setUpQuery = generatePSQLGenericUpdateRowQueryString<
        string | number | boolean
      >({
        updatedFields: [
          { field: "is_primary_card", value: false, settings: { includeIfEmpty: true } },
        ],
        fieldUsedToIdentifyUpdatedRow: {
          field: "user_id",
          value: userId,
        },
        tableName: this.tableName,
      });

      if (!isQueryEmpty({ query: setUpQuery })) {
        await this.datastorePool.query(setUpQuery);
      }

      const query = generatePSQLGenericUpdateRowQueryString<string | number | boolean>({
        updatedFields: [{ field: "is_primary_card", value: true }],
        fieldUsedToIdentifyUpdatedRow: {
          field: "local_credit_card_id",
          value: localCreditCardId,
        },
        tableName: this.tableName,
      });

      if (!isQueryEmpty({ query })) {
        await this.datastorePool.query(query);
      }
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at storedCreditCardDataTableService.makeCreditCardPrimary",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async unstoreCreditCard({
    controller,
    userId,
    localCreditCardId,
  }: {
    controller: Controller;
    userId: string;
    localCreditCardId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBStoredCreditCardDatum>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "user_id", value: userId },
          { field: "local_credit_card_id", value: localCreditCardId },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBStoredCreditCardDatum> =
        await this.datastorePool.query(query);

      if (response.rows.length < 1) {
        throw new Error("Missing cached credit card - none to delete");
      }

      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at storedCreditCardDataTableService.unstoreCreditCard",
      });
    }
  }
}
