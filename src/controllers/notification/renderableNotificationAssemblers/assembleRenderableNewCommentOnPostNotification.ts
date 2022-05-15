import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostCommentFromParts } from "../../postComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewCommentOnPostNotification } from "../models/renderableUserNotifications";

export async function assembleRenderableNewCommentOnPostNotification({
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<RenderableNewCommentOnPostNotification> {
  const {
    reference_table_id: postCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const unrenderablePostComment =
    await databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      { postCommentId },
    );

  const postComment = await constructRenderablePostCommentFromParts({
    blobStorageService,
    databaseService,
    unrenderablePostComment,
    clientUserId,
  });

  const unrenderablePostWithoutElementsOrHashtags =
    await databaseService.tableNameToServicesMap.postsTableService.getPostByPostId({
      postId: postComment.postId,
    });

  const post = await constructRenderablePostFromParts({
    blobStorageService,
    databaseService,
    unrenderablePostWithoutElementsOrHashtags,
    clientUserId,
  });

  const unrenderableUserThatCommented =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: unrenderablePostComment.authorUserId,
    });

  const userThatCommented = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: unrenderableUserThatCommented!,
    blobStorageService,
    databaseService,
  });

  const countOfUnreadNotifications =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: clientUserId },
    );

  return {
    countOfUnreadNotifications,
    userThatCommented,
    post,
    postComment,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
    eventTimestamp: postComment.creationTimestamp,
  };
}
