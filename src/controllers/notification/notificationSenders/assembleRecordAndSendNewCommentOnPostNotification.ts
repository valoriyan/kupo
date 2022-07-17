/* eslint-disable @typescript-eslint/ban-types */
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostFromPartsById } from "../../publishedItem/post/utilities";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { constructRenderablePostCommentFromPartsById } from "../../publishedItem/publishedItemComment/utilities";
import { v4 as uuidv4 } from "uuid";
import { RenderableNewCommentOnPostNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";

export async function assembleRecordAndSendNewCommentOnPostNotification({
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
  const constructRenderablePostFromPartsByIdResponse =
    await constructRenderablePostFromPartsById({
      controller,
      clientUserId: recipientUserId,
      publishedItemId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderablePostFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsByIdResponse;
  }
  const { success: post } = constructRenderablePostFromPartsByIdResponse;

  const constructRenderablePostCommentFromPartsByIdResponse =
    await constructRenderablePostCommentFromPartsById({
      controller,
      clientUserId: recipientUserId,
      postCommentId: publishedItemCommentId,
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
      clientUserId: recipientUserId,
      userId: postComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userThatCommented } = constructRenderableUserFromPartsByUserIdResponse;

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: post.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
        referenceTableId: publishedItemCommentId,
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

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

  return Success({});
}
