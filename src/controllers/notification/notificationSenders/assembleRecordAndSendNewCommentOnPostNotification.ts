import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostFromPartsById } from "../../publishedItem/post/utilities";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { constructRenderablePostCommentFromPartsById } from "../../postComment/utilities";
import { v4 as uuidv4 } from "uuid";
import { RenderableNewCommentOnPostNotification } from "../models/renderableUserNotifications";

export async function assembleRecordAndSendNewCommentOnPostNotification({
  publishedItemId,
  publishedItemCommentId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  publishedItemId: string;
  publishedItemCommentId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<void> {
  const post = await constructRenderablePostFromPartsById({
    clientUserId: recipientUserId,
    publishedItemId,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });

  const postComment = await constructRenderablePostCommentFromPartsById({
    clientUserId: recipientUserId,
    postCommentId: publishedItemCommentId,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });

  const userThatCommented = await constructRenderableUserFromPartsByUserId({
    clientUserId: recipientUserId,
    userId: postComment.authorUserId,
    blobStorageService,
    databaseService,
  });

  const countOfUnreadNotifications =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: post.authorUserId },
    );

  await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
    {
      userNotificationId: uuidv4(),
      recipientUserId,
      notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
      referenceTableId: publishedItemCommentId,
    },
  );

  const renderableNewCommentOnPostNotification: RenderableNewCommentOnPostNotification = {
    countOfUnreadNotifications,
    type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
    eventTimestamp: Date.now(),
    userThatCommented,
    post,
    postComment,
  };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewCommentOnPost(
    {
      userId: recipientUserId,
      renderableNewCommentOnPostNotification,
    },
  );
}
