import express from "express";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { EitherType, SecuredHTTPResponse } from "../../../types/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UnrenderableCanceledCommentOnPostNotification } from "../../notification/models/unrenderableCanceledUserNotifications";
import { PublishedItemCommentController } from "./publishedItemCommentController";

export interface DeletePublishedItemCommentRequestBody {
  postCommentId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePublishedItemCommentSuccess {}

export enum DeletePublishedItemCommentFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleDeletePublishedItemComment({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemCommentController;
  request: express.Request;
  requestBody: DeletePublishedItemCommentRequestBody;
}): Promise<
  SecuredHTTPResponse<
    DeletePublishedItemCommentFailedReason,
    DeletePublishedItemCommentSuccess
  >
> {
  const { postCommentId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { postId } =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      { postCommentId },
    );

  const { authorUserId: postAuthorUserId } =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: postId },
    );

  await controller.databaseService.tableNameToServicesMap.postCommentsTableService.deletePostComment(
    {
      postCommentId,
      authorUserId: clientUserId,
    },
  );

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
    {
      notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
      referenceTableId: postCommentId,
      recipientUserId: postAuthorUserId,
    },
  );

  const countOfUnreadNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: postAuthorUserId },
    );

  const unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPostNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_COMMENT_ON_POST,
      countOfUnreadNotifications,
      postCommentId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewCommentOnPost(
    {
      userId: postAuthorUserId,
      unrenderableCanceledCommentOnPostNotification,
    },
  );

  return {
    type: EitherType.success,
    success: {},
  };
}
