/* eslint-disable @typescript-eslint/ban-types */
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { NOTIFICATION_EVENTS } from "../../../../services/webSocketService/eventsConfig";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../../services/databaseService";
import { WebSocketService } from "../../../../services/webSocketService";

export async function assembleRecordAndSendCanceledNewUserFollowRequestNotification({
  controller,
  databaseService,
  webSocketService,
  recipientUserId,
  userIdWithdrawingFollowRequest,
  userFollowEventId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  webSocketService: WebSocketService;
  recipientUserId: string;
  userIdWithdrawingFollowRequest: string;
  userFollowEventId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Delete Notification from DB
  //////////////////////////////////////////////////

  const deleteUserNotificationForUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST,
          userFollowEventId,
        },
        recipientUserId,
      },
    );
  if (deleteUserNotificationForUserIdResponse.type == EitherType.failure) {
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

  const unrenderableCanceledNewUserFollowRequestNotification = {
    countOfUnreadNotifications,
    userIdWithdrawingFollowRequest,
    type: NOTIFICATION_EVENTS.CANCELED_NEW_USER_FOLLOW_REQUEST,
  };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: unrenderableCanceledNewUserFollowRequestNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
