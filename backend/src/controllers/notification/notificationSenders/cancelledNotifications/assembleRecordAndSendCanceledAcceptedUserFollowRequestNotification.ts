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
import { UnrenderableCanceledAcceptedUserFollowRequestNotification } from "../../models/unrenderableCanceledUserNotifications";

export async function assembleRecordAndSendCanceledAcceptedUserFollowRequestNotification({
  controller,
  userIdUnacceptingFollowRequest,
  userFollowEventId,
  recipientUserId,
  databaseService,
  webSocketService,
}: {
  controller: Controller;
  userIdUnacceptingFollowRequest: string;
  userFollowEventId: string;
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
          type: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
          userFollowEventId,
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

  const unrenderableCanceledAcceptedUserFollowRequestNotification: UnrenderableCanceledAcceptedUserFollowRequestNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_ACCEPTED_USER_FOLLOW_REQUEST,
      countOfUnreadNotifications,
      userIdUnacceptingFollowRequest,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledAcceptedUserFollowRequest(
    {
      userId: recipientUserId,
      unrenderableCanceledAcceptedUserFollowRequestNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
