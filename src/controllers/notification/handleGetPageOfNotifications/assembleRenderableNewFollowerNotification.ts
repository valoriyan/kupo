import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { RenderableNewFollowerNotification } from "../models";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

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
    reference_table_id: followingUserId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const unrenderableUser =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: followingUserId,
    });

  const userDoingFollowing = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: unrenderableUser!,
    blobStorageService,
    databaseService,
  });

  return {
    userDoingFollowing,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_FOLLOWER,
  };
}
