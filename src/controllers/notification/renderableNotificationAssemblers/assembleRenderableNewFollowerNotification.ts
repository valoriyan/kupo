import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewFollowerNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";

export async function assembleRenderableNewFollowerNotification({
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
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableNewFollowerNotification>
> {
  const {
    reference_table_id: userFollowEventId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

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
  const { success: unrenderableUserFollowEvent } = getUserFollowEventByIdResponse;

  const { userIdDoingFollowing, timestamp: eventTimestamp } = unrenderableUserFollowEvent;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: userIdDoingFollowing,
    });
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
  const { success: userDoingFollowing } = constructRenderableUserFromPartsResponse;

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );

  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  return Success({
    countOfUnreadNotifications,
    userDoingFollowing,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
    eventTimestamp,
  });
}
