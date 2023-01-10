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
import { UnrenderableCanceledNewShareOfPublishedItemNotification } from "../../models/unrenderableCanceledUserNotifications";

export async function assembleRecordAndSendCanceledNewShareOfPublishedItemNotification({
  controller,
  userIdNoLongerSharingPublishedItem,
  deletedPublishedItemId,
  recipientUserId,
  databaseService,
  webSocketService,
}: {
  controller: Controller;
  userIdNoLongerSharingPublishedItem: string;
  deletedPublishedItemId: string;
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
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM,
          publishedItemId: deletedPublishedItemId,
        },
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

  const unrenderableCanceledNewShareOfPublishedItemNotification: UnrenderableCanceledNewShareOfPublishedItemNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM,
      countOfUnreadNotifications,
      userIdNoLongerSharingPublishedItem: userIdNoLongerSharingPublishedItem,
      publishedItemId: deletedPublishedItemId,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: unrenderableCanceledNewShareOfPublishedItemNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
