import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewFollowerNotification } from "../models/renderableUserNotifications";

export async function assembleRenderableNewFollowerNotification({
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<RenderableNewFollowerNotification> {
  const {
    reference_table_id: userFollowEventId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const unrenderableUserFollowEvent =
    await databaseService.tableNameToServicesMap.userFollowsTableService.getUserFollowEventById(
      {
        userFollowEventId,
      },
    );

  const { userIdDoingFollowing, timestamp: eventTimestamp } = unrenderableUserFollowEvent;

  const unrenderableUserDoingFollowing =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: userIdDoingFollowing,
    });

  const userDoingFollowing = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: unrenderableUserDoingFollowing!,
    blobStorageService,
    databaseService,
  });

  const countOfUnreadNotifications =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: clientUserId },
    );

  return {
    countOfUnreadNotifications,
    userDoingFollowing,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
    eventTimestamp,
  };
}
