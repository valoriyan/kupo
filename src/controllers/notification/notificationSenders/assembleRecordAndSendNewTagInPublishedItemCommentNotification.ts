import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostFromPartsById } from "../../publishedItem/post/utilities";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { constructRenderablePostCommentFromPartsById } from "../../postComment/utilities";
import { v4 as uuidv4 } from "uuid";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";

export async function assembleRecordAndSendNewTagInPublishedItemCommentNotification({
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

  const userTaggingClient = await constructRenderableUserFromPartsByUserId({
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
      notificationType: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
      referenceTableId: publishedItemCommentId,
    },
  );

  const renderableNewTagInPublishedItemCommentNotification: RenderableNewTagInPublishedItemCommentNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
      eventTimestamp: Date.now(),
      userTaggingClient,
      publishedItem: post,
      publishedItemComment: postComment,
    };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewTagInPublishedItemComment(
    {
      userId: recipientUserId,
      renderableNewTagInPublishedItemCommentNotification,
    },
  );
}
