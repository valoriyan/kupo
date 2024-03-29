/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../../services/databaseService";
import { NOTIFICATION_EVENTS } from "../../../../services/webSocketService/eventsConfig";
import { Controller } from "tsoa";
import { WebSocketService } from "../../../../services/webSocketService";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { UnrenderableCanceledNewCommentOnPublishedItemNotification } from "../../models/unrenderableCanceledUserNotifications";

export async function assembleRecordAndSendCancelledNewCommentOnPublishedItemNotification({
  controller,
  publishedItemCommentId,
  recipientUserId,
  databaseService,
  webSocketService,
}: {
  controller: Controller;
  publishedItemCommentId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Delete Notification from DB
  //////////////////////////////////////////////////

  const deleteUserNotificationForUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
          publishedItemCommentId: publishedItemCommentId,
        },
        recipientUserId,
      },
    );
  if (deleteUserNotificationForUserIdResponse.type === EitherType.failure) {
    return deleteUserNotificationForUserIdResponse;
  }

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: recipientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Notification
  //////////////////////////////////////////////////

  const unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledNewCommentOnPublishedItemNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM,
      countOfUnreadNotifications,
      publishedItemCommentId: publishedItemCommentId,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: unrenderableCanceledCommentOnPostNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
