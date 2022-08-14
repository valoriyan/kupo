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
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBUserLoginAttempt {
  email: string;
  timestamp: string;
  ip_address: string;
  was_successful: boolean;
}

export class UserLoginAttemptsTableService extends TableService {
  public static readonly tableName = `user_login_attempts`;
  public readonly tableName = UserLoginAttemptsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        email VARCHAR(64) NOT NULL,
        timestamp BIGINT NOT NULL,
        ip_address VARCHAR(64) NOT NULL,
        was_successful boolean NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async recordLoginAttempt({
    controller,
    email,
    timestamp,
    ipAddress,
    wasSuccessful,
  }: {
    controller: Controller;
    email: string;
    timestamp: number;
    ipAddress: string;
    wasSuccessful: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const was_successful_value = !!wasSuccessful ? "true" : "false";

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "email", value: email },
            { field: "timestamp", value: timestamp },
            { field: "ip_address", value: ipAddress },
            { field: "was_successful", value: was_successful_value },
          ],
        ],
        tableName: this.tableName,
      });

      await this.datastorePool.query<DBUserLoginAttempt>(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserLoginAttemptsTableService.recordLoginAttempt",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getLoginAttemptsForEmail({
    controller,
    email,
    limit,
  }: {
    controller: Controller;
    email: string;
    limit?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserLoginAttempt[]>> {
    try {
      const queryValues = [email];

      let limitClause = "";
      if (!!limit) {
        limitClause = `
            LIMIT $${queryValues.length + 1}
          `;

        queryValues.push(limit.toString());
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            email = $1
          ORDER BY
            timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBUserLoginAttempt> = await this.datastorePool.query(
        query,
      );
      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserLoginAttemptsTableService.getLoginAttemptsForEmail",
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
