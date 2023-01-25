/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";
import { v4 as uuidv4 } from "uuid";
import { RenderableInvitedToFollowPublishingChannelNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageService } from "../../../services/blobStorageService";
import { assembleRenderablePublishingChannelById } from "../../../controllers/publishingChannel/utilities/assembleRenderablePublishingChannel";

export async function assembleRecordAndSendInvitedToFollowPublishingChannelNotification({
  controller,
  publishingChannelInvitationId,
  userIdSendingInvitation,
  publishingChannelId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishingChannelInvitationId: string;
  userIdSendingInvitation: string;
  publishingChannelId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Assemble Renderable User Sending Invitation
  //////////////////////////////////////////////////

  const assembleRenderableUserByIdResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: recipientUserId,
    userId: userIdSendingInvitation,
    blobStorageService,
    databaseService,
  });
  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: userSendingInvitation } = assembleRenderableUserByIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable Publishing Channel
  //////////////////////////////////////////////////
  const assembleRenderablePublishingChannelByIdResponse =
    await assembleRenderablePublishingChannelById({
      controller,
      blobStorageService,
      databaseService,
      publishingChannelId,
      requestorUserId: recipientUserId,
    });

  if (assembleRenderablePublishingChannelByIdResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelByIdResponse;
  }

  const { success: publishingChannel } = assembleRenderablePublishingChannelByIdResponse;

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
          type: NOTIFICATION_EVENTS.INVITED_TO_FOLLOW_PUBLISHING_CHANNEL,
          publishingChannelInvitationId,
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

  const renderableNewFollowerNotification: RenderableInvitedToFollowPublishingChannelNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.INVITED_TO_FOLLOW_PUBLISHING_CHANNEL,
      eventTimestamp: Date.now(),
      userSendingInvitation,
      publishingChannel,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: renderableNewFollowerNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
