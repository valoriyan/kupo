import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableInvitedToFollowPublishingChannelNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assembleRenderableUserById } from "../../../controllers/user/utilities/assembleRenderableUserById";
import { assembleRenderablePublishingChannelById } from "../../../controllers/publishingChannel/utilities/assembleRenderablePublishingChannel";

export async function assembleRenderableInvitedToFollowPublishingChannelNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    RenderableInvitedToFollowPublishingChannelNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    publishing_channel_invitation_reference: publishingChannelInvitationId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Get the User Follow Request
  //////////////////////////////////////////////////

  const getUserFollowEventByIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelInvitationsTableService.getPublishingChannelInvitationById(
      {
        controller,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        publishingChannelInvitationId: publishingChannelInvitationId!,
      },
    );
  if (getUserFollowEventByIdResponse.type === EitherType.failure) {
    return getUserFollowEventByIdResponse;
  }
  const {
    success: {
      user_id_sending_invitation,
      publishing_channel_id,
      creation_timestamp: eventTimestamp,
    },
  } = getUserFollowEventByIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable User Requesting to Follow Client
  //////////////////////////////////////////////////

  const assembleRenderableUserByIdResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: clientUserId,
    userId: user_id_sending_invitation,
    blobStorageService,
    databaseService,
  });
  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: userSendingInvitation } = assembleRenderableUserByIdResponse;

  //////////////////////////////////////////////////
  // Get Publishing Channel
  //////////////////////////////////////////////////
  const assembleRenderablePublishingChannelByIdResponse =
    await assembleRenderablePublishingChannelById({
      controller,
      blobStorageService,
      databaseService,
      publishingChannelId: publishing_channel_id,
      requestorUserId: clientUserId,
    });
  if (assembleRenderablePublishingChannelByIdResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelByIdResponse;
  }
  const { success: publishingChannel } = assembleRenderablePublishingChannelByIdResponse;

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );

  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    eventTimestamp: parseInt(eventTimestamp),
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.INVITED_TO_FOLLOW_PUBLISHING_CHANNEL,
    countOfUnreadNotifications,
    userSendingInvitation,
    publishingChannel,
  });
}
