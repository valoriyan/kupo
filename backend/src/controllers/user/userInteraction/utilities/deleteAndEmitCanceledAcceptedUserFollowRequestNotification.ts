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

export async function deleteAndEmitCanceledAcceptedUserFollowRequestNotification({
  controller,
  databaseService,
  webSocketService,
  recipientUserId,
  userIdUnacceptingFollowRequest,
  userFollowEventId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  webSocketService: WebSocketService;
  recipientUserId: string;
  userIdUnacceptingFollowRequest: string;
  userFollowEventId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // DELETE THE NOTIFICATION
  //////////////////////////////////////////////////

  const deleteUserNotificationForUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        notificationType: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
        referenceTableId: userFollowEventId,
        recipientUserId: recipientUserId,
      },
    );
  if (deleteUserNotificationForUserIdResponse.type == EitherType.failure) {
    return deleteUserNotificationForUserIdResponse;
  }

  //////////////////////////////////////////////////
  // GET THE COUNT OF UNREAD NOTIFICATIONS
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
  // ASSEMBLE NOTIFICATION
  //////////////////////////////////////////////////

  const unrenderableCanceledAcceptedUserFollowRequestNotification = {
    countOfUnreadNotifications,
    userIdUnacceptingFollowRequest,
    type: NOTIFICATION_EVENTS.CANCELED_ACCEPTED_USER_FOLLOW_REQUEST,
  };

  //////////////////////////////////////////////////
  // EMIT NOTIFICATION
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledAcceptedUserFollowRequest(
    {
      userId: recipientUserId,
      unrenderableCanceledAcceptedUserFollowRequestNotification,
    },
  );

  return Success({});
}
