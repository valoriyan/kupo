import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities/index";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

export interface DBUserNotification {
  user_notification_id: string;

  recipient_user_id: string;
  notification_type: string;

  timestamp_seen_by_user?: number;

  last_updated_timestamp: number;

  // if type = NEW_FOLLOWER: DBUserFollow [field: id];
  // if type = NEW_COMMENT_ON_POST: DBPostComment [field: post_comment_id];
  // if type = NEW_POST: DBPost [field: post_id]
  // if type = NEW_LIKE_ON_POST: DBPostLike [field: id]
  reference_table_id: string;
}

export class UserNotificationsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_user_notifications`;
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
    userNotificationId,
    recipientUserId,
    notificationType,
    referenceTableId,
  }: {
    userNotificationId: string;
    recipientUserId: string;
    notificationType: NOTIFICATION_EVENTS;
    referenceTableId: string;
  }): Promise<void> {
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
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectUserNotificationsByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<DBUserNotification[]> {
    const queryString = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          recipient_user_id = $1
        ORDER BY
          last_updated_timestamp DESC
        ;
      `,
      values: [userId],
    };

    const response: QueryResult<DBUserNotification> = await this.datastorePool.query(
      queryString,
    );

    const rows = response.rows;

    return rows;
  }

  public async doesUserNotificationExist({
    userId,
    referenceTableId,
  }: {
    userId: string;
    referenceTableId: string;
  }): Promise<boolean> {
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

    return rows.length === 1;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async markUserNotificationAsSeen({
    userNotificationId,
    timestampSeenByUser,
  }: {
    userNotificationId: string;
    timestampSeenByUser: number;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "timestamp_seen_by_user", value: timestampSeenByUser }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "user_notification_id",
        value: userNotificationId,
      },
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  public async setLastUpdatedTimestamp({
    userNotificationId,
    newUpdateTimestamp,
  }: {
    userNotificationId: string;
    newUpdateTimestamp: number;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "last_updated_timestamp", value: newUpdateTimestamp }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "user_notification_id",
        value: userNotificationId,
      },
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteUserNotificationForUserId({
    referenceTableId,
    recipientUserId,
    notificationType,
  }: {
    referenceTableId: string;
    recipientUserId: string;
    notificationType: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "reference_table_id", value: referenceTableId },
        { field: "notification_type", value: notificationType },
        { field: "recipient_user_id", value: recipientUserId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  public async deleteUserNotificationsForAllUsersByReferenceTableIds({
    referenceTableIds,
    notificationType,
  }: {
    referenceTableIds: string[];
    notificationType: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "notification_type", value: notificationType },
      ],
      fieldsUsedToIdentifyRowsToDeleteUsingInClauses: [
        { field: "reference_table_id", values: referenceTableIds },
      ],
      tableName: this.tableName,
    });


    console.log("query");
    console.log(query);
    
    await this.datastorePool.query(query);
  }  
}
