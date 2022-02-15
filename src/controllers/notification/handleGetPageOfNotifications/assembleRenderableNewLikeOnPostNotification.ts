import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { RenderableNewLikeOnPostNotification } from "../models";
import { constructRenderablePostFromParts } from "../../post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
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
  const { reference_table_id: postLikeId, timestamp_seen_by_user: timestampSeenByUser } =
    userNotification;

  const { post_id: postId, user_id: userLikingPostId } =
    await databaseService.tableNameToServicesMap.postLikesTableService.getPostLikeByPostLikeId(
      { postLikeId },
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

  const unrenderableUserThatLikedPost =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: userLikingPostId,
    });

  if (!unrenderableUserThatLikedPost) {
    throw new Error("Missing user that liked post");
  }

  const userThatLikedPost = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: unrenderableUserThatLikedPost,
    blobStorageService,
    databaseService,
  });

  return {
    userThatLikedPost,
    post,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
  };
}
