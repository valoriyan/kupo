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
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBUserLoginAttempt {
    username: string;
    timestamp: string;
    ip_address: string;
    was_successful: boolean;
}

export class UserLoginAttemptsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_user_login_attempts`;
  public readonly tableName = UserLoginAttemptsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        username VARCHAR(64) NOT NULL,
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
    username,
    timestamp,
    ipAddress,
    wasSuccessful,
  }: {
    controller: Controller;
    username: string;
    timestamp: number;
    ipAddress: string;
    wasSuccessful: boolean,
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
        const was_successful_value = !!wasSuccessful ? "true" : "false";


        const query = generatePSQLGenericCreateRowsQuery<string | number>({
            rowsOfFieldsAndValues: [
              [
                { field: "username", value: username },
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

  public async getLoginAttemptsForUsername({
    controller,
    username,
    limit,
  }: {
    controller: Controller;
    username: string;
    limit?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserLoginAttempt[]>> {
    try {
        const queryValues = [username];

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
            username = $1
          ORDER BY
            timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBUserLoginAttempt> = await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserLoginAttemptsTableService.getLoginAttemptsForUserId",
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
