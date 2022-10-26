import express from "express";
import { GenericResponseFailedReason } from "src/controllers/models";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UnrenderableCanceledCommentOnPublishedItemNotification } from "../../notification/models/unrenderableCanceledUserNotifications";
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

  const getMaybePublishedItemCommentByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getMaybePublishedItemCommentById(
      { controller, publishedItemCommentId: postCommentId },
    );
  if (getMaybePublishedItemCommentByIdResponse.type === EitherType.failure) {
    return getMaybePublishedItemCommentByIdResponse;
  }
  const { success: maybeUnrenderablePublishedItemComment } =
    getMaybePublishedItemCommentByIdResponse;

  if (!maybeUnrenderablePublishedItemComment) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: `Published item with publishedItemCommentId "${postCommentId}" not found at handleDeletePublishedItemComment`,
      additionalErrorInformation: `Published item with publishedItemCommentId "${postCommentId}" not found at handleDeletePublishedItemComment`,
    });
  }
  const { publishedItemId } = maybeUnrenderablePublishedItemComment;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const {
    success: { authorUserId: postAuthorUserId },
  } = getPublishedItemByIdResponse;

  const deletePostCommentResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.deletePublishedItemComment(
      {
        controller,
        publishedItemCommentId: postCommentId,
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
        notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
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

  const unrenderableCanceledCommentOnPublishedItemNotification: UnrenderableCanceledCommentOnPublishedItemNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM,
      countOfUnreadNotifications,
      publishedItemCommentId: postCommentId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewCommentOnPost(
    {
      userId: postAuthorUserId,
      unrenderableCanceledCommentOnPostNotification:
        unrenderableCanceledCommentOnPublishedItemNotification,
    },
  );

  return Success({});
}
