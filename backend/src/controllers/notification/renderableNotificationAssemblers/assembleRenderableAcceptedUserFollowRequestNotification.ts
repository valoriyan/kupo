import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableAcceptedUserFollowRequestNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { BlobStorageService } from "../../../services/blobStorageService";
import { assembleRenderableUserById } from "../../../controllers/user/utilities/assembleRenderableUserById";

export async function assembleRenderableAcceptedUserFollowRequestNotification({
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
    RenderableAcceptedUserFollowRequestNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    user_follow_reference: userFollowEventId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Get the User Follow Request
  //////////////////////////////////////////////////

  const getUserFollowEventByIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.getUserFollowEventById(
      {
        controller,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userFollowEventId: userFollowEventId!,
      },
    );
  if (getUserFollowEventByIdResponse.type === EitherType.failure) {
    return getUserFollowEventByIdResponse;
  }
  const {
    success: { userIdBeingFollowed, timestamp: eventTimestamp },
  } = getUserFollowEventByIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable User Doing the Following
  //////////////////////////////////////////////////

  const assembleRenderableUserByIdResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: clientUserId,
    userId: userIdBeingFollowed,
    blobStorageService,
    databaseService,
  });
  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: userAcceptingFollowRequest } = assembleRenderableUserByIdResponse;

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
    eventTimestamp,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
    countOfUnreadNotifications,
    userAcceptingFollowRequest,
  });
}
