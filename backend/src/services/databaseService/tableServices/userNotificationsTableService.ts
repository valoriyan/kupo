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
import { UsersTableService } from "./users/usersTableService";
import { UserFollowsTableService } from "./users/userFollowsTableService";
import { PublishedItemsTableService } from "./publishedItem/publishedItemsTableService";
import { PublishedItemCommentsTableService } from "./publishedItem/publishedItemCommentsTableService";
import { PublishedItemLikesTableService } from "./publishedItem/publishedItemLikesTableService";
import { PublishedItemTransactionsTableService } from "./publishedItem/publishedItemTransactionsTableService";

export type UserNotificationDbReference =
  | {
      type: NOTIFICATION_EVENTS.NEW_FOLLOWER;
      userFollowEventId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST;
      userFollowEventId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST;
      userFollowEventId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM;
      publishedItemCommentId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT;
      publishedItemCommentId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION;
      publishedItemId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM;
      publishedItemLikeId: string;
    }
  | {
      type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD;
      publishedItemTransactionId: string;
    };

export interface DBUserNotification {
  user_notification_id: string;

  recipient_user_id: string;
  notification_type: NOTIFICATION_EVENTS;

  timestamp_seen_by_user?: number;

  last_updated_timestamp: number;

  user_follow_reference?: string;
  published_item_reference?: string;
  published_item_comment_reference?: string;
  published_item_like_reference?: string;
  published_item_transaction_reference?: string;
}

function generateReferenceTableRow({
  userNotificationDbReference,
}: {
  userNotificationDbReference: UserNotificationDbReference;
}) {
  const notificationType = userNotificationDbReference.type;

  if (notificationType === NOTIFICATION_EVENTS.NEW_FOLLOWER) {
    return {
      field: "user_follow_reference",
      value: userNotificationDbReference.userFollowEventId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST) {
    return {
      field: "user_follow_reference",
      value: userNotificationDbReference.userFollowEventId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST) {
    return {
      field: "user_follow_reference",
      value: userNotificationDbReference.userFollowEventId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM) {
    return {
      field: "published_item_comment_reference",
      value: userNotificationDbReference.publishedItemCommentId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT) {
    return {
      field: "published_item_comment_reference",
      value: userNotificationDbReference.publishedItemCommentId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION) {
    return {
      field: "published_item_reference",
      value: userNotificationDbReference.publishedItemId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM) {
    return {
      field: "published_item_like_reference",
      value: userNotificationDbReference.publishedItemLikeId,
    };
  } else if (notificationType === NOTIFICATION_EVENTS.SHOP_ITEM_SOLD) {
    return {
      field: "published_item_transaction_reference",
      value: userNotificationDbReference.publishedItemTransactionId,
    };
  } else {
    throw new Error(
      `Unhandled notification type "${notificationType}" @ generateReferenceTableRow`,
    );
  }
}

export class UserNotificationsTableService extends TableService {
  public static readonly tableName = `user_notifications`;
  public readonly tableName = UserNotificationsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    UsersTableService.tableName,
    UserFollowsTableService.tableName,
    PublishedItemsTableService.tableName,
    PublishedItemCommentsTableService.tableName,
    PublishedItemLikesTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_notification_id VARCHAR(64) UNIQUE NOT NULL,

        recipient_user_id VARCHAR(64) NOT NULL,
        notification_type VARCHAR(64) NOT NULL,

        timestamp_seen_by_user BIGINT,
        last_updated_timestamp BIGINT NOT NULL,

        user_follow_reference VARCHAR(64),
        published_item_reference VARCHAR(64),
        published_item_comment_reference VARCHAR(64),
        published_item_like_reference VARCHAR(64),
        published_item_transaction_reference VARCHAR(64),
      

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (user_notification_id),
          
        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (recipient_user_id)
          REFERENCES ${UsersTableService.tableName} (user_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${UserFollowsTableService.tableName}_reference_fkey
          FOREIGN KEY (user_follow_reference)
          REFERENCES ${UserFollowsTableService.tableName} (user_follow_event_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_reference_fkey
          FOREIGN KEY (published_item_reference)
          REFERENCES ${PublishedItemsTableService.tableName} (id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishedItemCommentsTableService.tableName}_reference_fkey
          FOREIGN KEY (published_item_comment_reference)
          REFERENCES ${PublishedItemCommentsTableService.tableName} (published_item_comment_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishedItemLikesTableService.tableName}_reference_fkey
          FOREIGN KEY (published_item_like_reference)
          REFERENCES ${PublishedItemLikesTableService.tableName} (published_item_like_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishedItemTransactionsTableService.tableName}_reference_fkey
          FOREIGN KEY (published_item_transaction_reference)
          REFERENCES ${PublishedItemTransactionsTableService.tableName} (published_item_transaction_id)
          ON DELETE CASCADE,


        CONSTRAINT user_follow_reference_null_constraint 
          CHECK (
              (
                  (
                      (notification_type = '${NOTIFICATION_EVENTS.NEW_FOLLOWER}')
                    OR
                      (notification_type = '${NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST}')
                    OR
                      (notification_type = '${NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST}')
                  )
                AND
                  (user_follow_reference IS NOT NULL)
              )
            OR
              (
                  (
                      (notification_type != '${NOTIFICATION_EVENTS.NEW_FOLLOWER}')
                    OR
                      (notification_type != '${NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST}')
                    OR
                      (notification_type != '${NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST}')
                  )
                AND
                  (user_follow_reference IS NULL)
              )
          ),

        CONSTRAINT published_item_comment_reference_null_constraint 
          CHECK (
              (
                  (
                      notification_type != '${NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM}'
                    OR
                      notification_type != '${NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT}'
                  )
                AND
                  (published_item_comment_reference IS NOT NULL)
              )
            OR
              (
                  (
                      notification_type != '${NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM}'
                    OR
                      notification_type != '${NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT}'
                  )
                AND
                  (published_item_comment_reference IS NULL)
              )
          ),

          CONSTRAINT published_item_like_reference_null_constraint 
            CHECK (
                (
                    (notification_type = '${NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM}')
                  AND
                    (published_item_like_reference IS NOT NULL)
                )
              OR
                (
                    (notification_type != '${NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM}')
                  AND
                    (published_item_like_reference IS NULL)
                )
            ),

          CONSTRAINT published_item_reference_null_constraint 
            CHECK (
                (
                    (notification_type = '${NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION}')
                  AND
                    (published_item_reference IS NOT NULL)
                )
              OR
                (
                    (notification_type != '${NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION}')
                  AND
                    (published_item_reference IS NULL)
                )
            ),
            
          CONSTRAINT published_item_transaction_reference_null_constraint 
            CHECK (
                (
                    (notification_type = '${NOTIFICATION_EVENTS.SHOP_ITEM_SOLD}')
                  AND
                    (published_item_transaction_reference IS NOT NULL)
                )
              OR
                (
                    (notification_type != '${NOTIFICATION_EVENTS.SHOP_ITEM_SOLD}')
                  AND
                    (published_item_transaction_reference IS NULL)
                )
            )
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
    externalReference,
  }: {
    controller: Controller;
    userNotificationId: string;
    recipientUserId: string;
    externalReference: UserNotificationDbReference;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, DBUserNotification>> {
    const notificationType = externalReference.type;

    const referenceTableRow = generateReferenceTableRow({
      userNotificationDbReference: externalReference,
    });

    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_notification_id", value: userNotificationId },
            { field: "recipient_user_id", value: recipientUserId },
            { field: "notification_type", value: notificationType },

            referenceTableRow,

            { field: "last_updated_timestamp", value: Date.now() },
          ],
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBUserNotification> = await this.datastorePool.query(
        query,
      );
      const rows = response.rows;

      return Success(rows[0]);
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

  public async maybeGetUserNotificationByUserFollowReference({
    controller,
    userId,
    userFollowReference,
  }: {
    controller: Controller;
    userId: string;
    userFollowReference: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBUserNotification | undefined>
  > {
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
              user_follow_reference = $2
          ORDER BY
            last_updated_timestamp DESC
          LIMIT
            1
          ;
        `,
        values: [userId, userFollowReference],
      };

      const response: QueryResult<DBUserNotification> = await this.datastorePool.query(
        queryString,
      );

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(rows[0]);
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at userNotificationsTableService.maybeGetUserNotificationByUserFollowReference",
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
    recipientUserId,
    externalReference,
  }: {
    controller: Controller;
    recipientUserId: string;
    externalReference: UserNotificationDbReference;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    const referenceTableRow = generateReferenceTableRow({
      userNotificationDbReference: externalReference,
    });

    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          referenceTableRow,
          { field: "notification_type", value: externalReference.type },
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

  public async deleteNewLikeOnPublishedItemUserNotificationsForAllUsers({
    controller,
    publishedItemLikeIds,
  }: {
    controller: Controller;
    publishedItemLikeIds: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          {
            field: "notification_type",
            value: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
          },
        ],
        fieldsUsedToIdentifyRowsToDeleteUsingInClauses: [
          { field: "published_item_like_reference", values: publishedItemLikeIds },
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
