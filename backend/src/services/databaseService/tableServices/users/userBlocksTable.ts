/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { Controller } from "tsoa";

import { TableService } from "../models";
import { UsersTableService } from "./usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { generatePSQLGenericDeleteRowsQueryString } from "../utilities";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBUserBlock {
  blocked_user_id: string;
  executor_user_id: string;
  execution_timestamp: string;
}

export class UserBlocksTableService extends TableService {
  public static readonly tableName = `user_blocks`;
  public readonly tableName = UserBlocksTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [UsersTableService.tableName];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        blocked_user_id VARCHAR(64) NOT NULL,
        executor_user_id VARCHAR(64) NOT NULL,
        execution_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (blocked_user_id, executor_user_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_banned_fkey
          FOREIGN KEY (blocked_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_executor_fkey
          FOREIGN KEY (executor_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async executeBlockOfUserIdByUserId({
    controller,
    blockedUserId,
    executorUserId,
    executionTimestamp,
  }: {
    controller: Controller;
    blockedUserId: string;
    executorUserId: string;
    executionTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "blocked_user_id", value: blockedUserId },
            { field: "executor_user_id", value: executorUserId },
            { field: "execution_timestamp", value: executionTimestamp },
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
          "Error at UserBlocksTableService.executeBlockOfUserIdByUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async isUserIdBlockedByUserId({
    controller,
    maybeBlockedUserId,
    maybeExecutorUserId,
  }: {
    controller: Controller;
    maybeBlockedUserId: string;
    maybeExecutorUserId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
    try {
      const values = [maybeBlockedUserId, maybeExecutorUserId];

      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            blocked_user_id = $1
          AND
            executor_user_id = $2
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBUserBlock> = await this.datastorePool.query(query);

      return Success(response.rows.length === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserBlocksTableService.isUserIdBlockedByUserId",
      });
    }
  }

  public async areAnyOfUserIdsBlockingUserId({
    controller,
    maybeBlockedUserId,
    maybeExecutorUserIds,
  }: {
    controller: Controller;
    maybeBlockedUserId: string;
    maybeExecutorUserIds: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      if (maybeExecutorUserIds.length === 0) {
        return Success([]);
      }

      const values = [maybeBlockedUserId];

      let executorUserIdsCondition = "";
      executorUserIdsCondition += `AND executor_user_id IN  ( `;

      const executorIdParameterStrings: string[] = [];
      maybeExecutorUserIds.forEach((maybeExecutorUserId) => {
        executorIdParameterStrings.push(`$${values.length + 1}`);
        values.push(maybeExecutorUserId);
      });
      executorUserIdsCondition += ` )`;

      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            blocked_user_id = $1
            ${executorUserIdsCondition}
          LIMIT
            1
          ;
        `,
        values,
      };

      const response: QueryResult<DBUserBlock> = await this.datastorePool.query(query);

      return Success(response.rows.map(({ executor_user_id }) => executor_user_id));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserBlocksTableService.areAnyOfUserIdsBlockingUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async removeBlockOfUserIdAgainstUserId({
    controller,
    blockedUserId,
    executorUserId,
  }: {
    controller: Controller;
    blockedUserId: string;
    executorUserId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserBlock>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "blocked_user_id", value: blockedUserId },
          { field: "executor_user_id", value: executorUserId },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBUserBlock>(query);
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at UserBlocksTableService.removeBlockOfUserIdAgainstUserId",
      });
    }
  }
}
