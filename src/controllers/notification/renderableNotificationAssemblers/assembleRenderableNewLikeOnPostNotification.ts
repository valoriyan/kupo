import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewLikeOnPostNotification } from "../models/renderableUserNotifications";

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
  const { reference_table_id: publishedItemLikeId, timestamp_seen_by_user: timestampSeenByUser } =
    userNotification;

  const {
    published_item_id: postId,
    user_id: userLikingPostId,
    timestamp: eventTimestampString,
  } = await databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPostLikeByPublishedItemLikeId(
    { publishedItemLikeId },
  );

  const unrenderablePostWithoutElementsOrHashtags =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        id: postId,
      },
    );

  const post = await constructRenderablePostFromParts({
    blobStorageService,
    databaseService,
    uncompiledBasePublishedItem: unrenderablePostWithoutElementsOrHashtags,
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

  const countOfUnreadNotifications =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: clientUserId },
    );

  return {
    countOfUnreadNotifications,
    userThatLikedPost,
    post,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
    eventTimestamp: parseInt(eventTimestampString),
  };
}
