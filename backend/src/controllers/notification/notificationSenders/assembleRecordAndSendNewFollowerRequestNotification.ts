/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";
import { RenderableNewUserFollowRequestNotification } from "../models/renderableUserNotifications";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function assembleRecordAndSendNewFollowerRequestNotification({
  controller,
  userFollowEventId,
  userIdDoingFollowing,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  userFollowEventId: string;
  userIdDoingFollowing: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Assemble User That Authored Comment
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: recipientUserId,
      userId: userIdDoingFollowing,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: followRequestingUser } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Write Notification to DB
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST,
          userFollowEventId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
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

  const renderableNewUserFollowRequestNotification: RenderableNewUserFollowRequestNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_USER_FOLLOW_REQUEST,
      eventTimestamp: Date.now(),
      followRequestingUser,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewUserFollowRequest(
    {
      userId: recipientUserId,
      renderableNewUserFollowRequestNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
