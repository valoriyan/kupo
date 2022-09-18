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

export async function deleteAndEmitCanceledNewFollowerNotification({
  controller,
  databaseService,
  webSocketService,
  recipientUserId,
  userIdDoingUnfollowing,
  userFollowEventId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  webSocketService: WebSocketService;
  recipientUserId: string;
  userIdDoingUnfollowing: string;
  userFollowEventId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // DELETE THE NOTIFICATION
  //////////////////////////////////////////////////

  const deleteUserNotificationForUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        notificationType: NOTIFICATION_EVENTS.NEW_FOLLOWER,
        referenceTableId: userFollowEventId,
        recipientUserId,
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

  const unrenderableCanceledNewFollowerNotification = {
    countOfUnreadNotifications,
    userIdDoingUnfollowing,
    type: NOTIFICATION_EVENTS.CANCELED_NEW_FOLLOWER,
  };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewFollower(
    {
      userId: recipientUserId,
      unrenderableCanceledNewFollowerNotification,
    },
  );

  return Success({});
}
