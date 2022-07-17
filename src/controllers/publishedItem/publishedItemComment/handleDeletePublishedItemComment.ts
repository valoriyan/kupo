import express from "express";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
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
    ErrorReasonTypes<string | DeletePublishedItemCommentFailedReason>,
    DeletePublishedItemCommentSuccess
  >
> {
  const { postCommentId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getPostCommentByIdResponse =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      { controller, postCommentId },
    );
  if (getPostCommentByIdResponse.type === EitherType.failure) {
    return getPostCommentByIdResponse;
  }
  const {
    success: { postId },
  } = getPostCommentByIdResponse;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: postId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const {
    success: { authorUserId: postAuthorUserId },
  } = getPublishedItemByIdResponse;

  const deletePostCommentResponse =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.deletePostComment(
      {
        controller,
        postCommentId,
        authorUserId: clientUserId,
      },
    );
  if (deletePostCommentResponse.type === EitherType.failure) {
    return deletePostCommentResponse;
  }

  const deleteUserNotificationForUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
        referenceTableId: postCommentId,
        recipientUserId: postAuthorUserId,
      },
    );
  if (deleteUserNotificationForUserIdResponse.type === EitherType.failure) {
    return deleteUserNotificationForUserIdResponse;
  }

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: postAuthorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

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

  return Success({});
}
