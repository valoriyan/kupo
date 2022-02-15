import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { RenderableNewLikeOnPostNotification } from "../models";
import { constructRenderablePostFromParts } from "../../post/utilities";
import { constructRenderableUsersFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

export async function assembleRenderableNewLikeOnPostNotification({
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<RenderableNewLikeOnPostNotification> {
  const NUMBER_OF_USERS_TO_SHOW = 5;

  const { reference_table_id: postId, timestamp_seen_by_user: timestampSeenByUser } =
    userNotification;

  const userIdsLikingPost =
    await databaseService.tableNameToServicesMap.postLikesTableService.getUserIdsLikingPostId(
      { postId },
    );

  const unrenderablePostWithoutElementsOrHashtags =
    await databaseService.tableNameToServicesMap.postsTableService.getPostByPostId({
      postId,
    });

  const post = await constructRenderablePostFromParts({
    blobStorageService,
    databaseService,
    unrenderablePostWithoutElementsOrHashtags,
    clientUserId,
  });

  const unrenderableUsersThatCommented =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      userIds: userIdsLikingPost.slice(-NUMBER_OF_USERS_TO_SHOW),
    });

  const usersThatLikedPost = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers: unrenderableUsersThatCommented,
    blobStorageService,
    databaseService,
  });

  return {
    usersThatLikedPost,
    post,
    count: userIdsLikingPost.length,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
  };
}
