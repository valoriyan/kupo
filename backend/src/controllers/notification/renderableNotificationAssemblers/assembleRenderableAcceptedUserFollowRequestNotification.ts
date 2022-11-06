import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableAcceptedUserFollowRequestNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";

export async function assembleRenderableAcceptedUserFollowRequestNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    RenderableAcceptedUserFollowRequestNotification
  >
> {
  const {
    reference_table_id: userFollowEventId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // GET THE USER FOLLOW REQUEST
  //////////////////////////////////////////////////

  const getUserFollowEventByIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.getUserFollowEventById(
      {
        controller,
        userFollowEventId,
      },
    );
  if (getUserFollowEventByIdResponse.type === EitherType.failure) {
    return getUserFollowEventByIdResponse;
  }
  const {
    success: { userIdBeingFollowed, timestamp: eventTimestamp },
  } = getUserFollowEventByIdResponse;

  //////////////////////////////////////////////////
  // GET THE USER DOING THE FOLLOWING
  //////////////////////////////////////////////////

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: userIdBeingFollowed,
      },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserDoingFollowing } = selectUserByUserIdResponse;

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: unrenderableUserDoingFollowing!,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userAcceptingFollowRequest } =
    constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // GET THE COUNT OF UNREAD NOTIFICATIONS
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
  // RETURN
  //////////////////////////////////////////////////

  return Success({
    eventTimestamp,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
    countOfUnreadNotifications,
    userAcceptingFollowRequest,
  });
}
