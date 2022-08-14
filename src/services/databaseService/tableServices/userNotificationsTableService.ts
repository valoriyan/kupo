/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities/index";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { Controller } from "tsoa";

export interface DBUserNotification {
  user_notification_id: string;

  recipient_user_id: string;
  notification_type: string;

  timestamp_seen_by_user?: number;

  last_updated_timestamp: number;

  // if type = NEW_FOLLOWER: DBUserFollow [field: id];
  // if type = NEW_COMMENT_ON_POST: DBPostComment [field: post_comment_id];
  // if type = NEW_POST: DBPost [field: published_item_id]
  // if type = NEW_LIKE_ON_POST: DBPostLike [field: id]
  reference_table_id: string;
}

export class UserNotificationsTableService extends TableService {
  public static readonly tableName = `user_notifications`;
  public readonly tableName = UserNotificationsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_notification_id VARCHAR(64) UNIQUE NOT NULL,

        recipient_user_id VARCHAR(64) NOT NULL,
        notification_type VARCHAR(64) NOT NULL,

        timestamp_seen_by_user BIGINT,
        last_updated_timestamp BIGINT NOT NULL,

        reference_table_id VARCHAR(64) NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createUserNotification({
    controller,
    userNotificationId,
    recipientUserId,
    notificationType,
    referenceTableId,
  }: {
    controller: Controller;
    userNotificationId: string;
    recipientUserId: string;
    notificationType: NOTIFICATION_EVENTS;
    referenceTableId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_notification_id", value: userNotificationId },
            { field: "recipient_user_id", value: recipientUserId },
            { field: "notification_type", value: notificationType },
            { field: "reference_table_id", value: referenceTableId },
            { field: "last_updated_timestamp", value: Date.now() },
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
          "Error at userNotificationsTableService.createUserNotification",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectUserNotificationsByUserId({
    controller,
    userId,
    limit,
    getNotificationsUpdatedBeforeTimestamp,
  }: {
    controller: Controller;
    userId: string;
    limit?: number;
    getNotificationsUpdatedBeforeTimestamp?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserNotification[]>> {
    try {
      const queryValues: (number | string)[] = [userId];

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${queryValues.length + 1}
        `;

        queryValues.push(limit);
      }

      let getNotificationsUpdatedBeforeTimestampClause = "";
      if (!!getNotificationsUpdatedBeforeTimestamp) {
        getNotificationsUpdatedBeforeTimestampClause = `
          AND
            last_updated_timestamp < $${queryValues.length + 1}
        `;

        queryValues.push(getNotificationsUpdatedBeforeTimestamp);
      }

      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            recipient_user_id = $1
            ${getNotificationsUpdatedBeforeTimestampClause}
          ORDER BY
            last_updated_timestamp DESC
          ${limitClause}
          ;
        `,
        values: queryValues,
      };

      const response: QueryResult<DBUserNotification> = await this.datastorePool.query(
        queryString,
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
          "Error at userNotificationsTableService.selectUserNotificationsByUserId",
      });
    }
  }

  public async doesUserNotificationExist({
    controller,
    userId,
    referenceTableId,
  }: {
    controller: Controller;
    userId: string;
    referenceTableId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
    try {
      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
              recipient_user_id = $1
            AND
              reference_table_id = $2
          ORDER BY
            last_updated_timestamp DESC
          LIMIT
            1
          ;
        `,
        values: [userId, referenceTableId],
      };

      const response: QueryResult<DBUserNotification> = await this.datastorePool.query(
        queryString,
      );

      const rows = response.rows;

      return Success(rows.length === 1);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userNotificationsTableService.doesUserNotificationExist",
      });
    }
  }

  public async selectCountOfUnreadUserNotificationsByUserId({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const query = {
        text: `
          SELECT
            COUNT(*)
          FROM
            ${this.tableName}
          WHERE
              recipient_user_id = $1
            AND
              timestamp_seen_by_user IS NULL
          ;
        `,
        values: [userId],
      };

      const response: QueryResult<{
        count: string;
      }> = await this.datastorePool.query(query);

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async markAllUserNotificationsAsSeen({
    controller,
    recipientUserId,
    timestampSeenByUser,
  }: {
    controller: Controller;
    recipientUserId: string;
    timestampSeenByUser: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = {
        text: `
          UPDATE
            ${this.tableName}
          SET
            timestamp_seen_by_user = $1
          WHERE
              timestamp_seen_by_user IS NULL
            AND
              recipient_user_id = $2
          ;
        `,
        values: [timestampSeenByUser, recipientUserId],
      };

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userNotificationsTableService.markAllUserNotificationsAsSeen",
      });
    }
  }

  public async setLastUpdatedTimestamp({
    controller,
    userNotificationId,
    newUpdateTimestamp,
  }: {
    controller: Controller;
    userNotificationId: string;
    newUpdateTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "last_updated_timestamp", value: newUpdateTimestamp }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_notification_id",
            value: userNotificationId,
          },
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
          "Error at userNotificationsTableService.setLastUpdatedTimestamp",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteUserNotificationForUserId({
    controller,
    referenceTableId,
    recipientUserId,
    notificationType,
  }: {
    controller: Controller;
    referenceTableId: string;
    recipientUserId: string;
    notificationType: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "reference_table_id", value: referenceTableId },
          { field: "notification_type", value: notificationType },
          { field: "recipient_user_id", value: recipientUserId },
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
          "Error at userNotificationsTableService.deleteUserNotificationForUserId",
      });
    }
  }

  public async deleteUserNotificationsForAllUsersByReferenceTableIds({
    controller,
    referenceTableIds,
    notificationType,
  }: {
    controller: Controller;
    referenceTableIds: string[];
    notificationType: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "notification_type", value: notificationType },
        ],
        fieldsUsedToIdentifyRowsToDeleteUsingInClauses: [
          { field: "reference_table_id", values: referenceTableIds },
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
          "Error at userNotificationsTableService.deleteUserNotificationsForAllUsersByReferenceTableIds",
      });
    }
  }
}
