/* eslint-disable @typescript-eslint/ban-types */
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostFromPartsById } from "../../publishedItem/post/utilities";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { constructRenderablePublishedItemCommentFromPartsById } from "../../publishedItem/publishedItemComment/utilities";
import { v4 as uuidv4 } from "uuid";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";

export async function assembleRecordAndSendNewTagInPublishedItemCommentNotification({
  controller,
  publishedItemId,
  publishedItemCommentId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishedItemId: string;
  publishedItemCommentId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // COMPILE INFORMATION NEEDED TO WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////

  const constructRenderablePostFromPartsByIdResponse =
    await constructRenderablePostFromPartsById({
      controller,
      requestorUserId: recipientUserId,
      publishedItemId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderablePostFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsByIdResponse;
  }
  const { success: post } = constructRenderablePostFromPartsByIdResponse;

  const constructRenderablePostCommentFromPartsByIdResponse =
    await constructRenderablePublishedItemCommentFromPartsById({
      controller,
      clientUserId: recipientUserId,
      publishedItemCommentId: publishedItemCommentId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderablePostCommentFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsByIdResponse;
  }
  const { success: postComment } = constructRenderablePostCommentFromPartsByIdResponse;

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId: recipientUserId,
      userId: postComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        notificationType: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
        referenceTableId: publishedItemCommentId,
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // GET COUNT OF UNREAD NOTIFICATIONS
  //////////////////////////////////////////////////
  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: post.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // COMPILE AND SEND NOTIFICATION TO CLIENT
  //////////////////////////////////////////////////

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
  return Success({});
}
