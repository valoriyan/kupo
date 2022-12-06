import express from "express";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import {
  UnrenderableCanceledCommentOnPublishedItemNotification,
  UnrenderableCanceledNewTagInPublishedItemCommentNotification,
} from "../../notification/models/unrenderableCanceledUserNotifications";
import { PublishedItemCommentController } from "./publishedItemCommentController";

export interface DeletePublishedItemCommentRequestBody {
  publishedItemCommentId: string;
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
  //////////////////////////////////////////////////
  // PARSE INPUTS
  //////////////////////////////////////////////////

  const { publishedItemCommentId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // GET COMMENT
  //////////////////////////////////////////////////

  const getMaybePublishedItemCommentByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getMaybePublishedItemCommentById(
      { controller, publishedItemCommentId: publishedItemCommentId },
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
      error: `Published item with publishedItemCommentId "${publishedItemCommentId}" not found at handleDeletePublishedItemComment`,
      additionalErrorInformation: `Published item with publishedItemCommentId "${publishedItemCommentId}" not found at handleDeletePublishedItemComment`,
    });
  }
  const { publishedItemId } = maybeUnrenderablePublishedItemComment;

  //////////////////////////////////////////////////
  // UPDATE PUBLISHED ITEM
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // DELETE COMMENT IN DB
  //////////////////////////////////////////////////

  const deletePostCommentResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.deletePublishedItemComment(
      {
        controller,
        publishedItemCommentId: publishedItemCommentId,
        authorUserId: clientUserId,
      },
    );
  if (deletePostCommentResponse.type === EitherType.failure) {
    return deletePostCommentResponse;
  }

  //////////////////////////////////////////////////
  // DELETE USER NOTIFICATION
  //////////////////////////////////////////////////

  const firstDeleteUserNotificationForUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
          publishedItemCommentId: publishedItemCommentId,
        },
        recipientUserId: postAuthorUserId,
      },
    );
  if (firstDeleteUserNotificationForUserIdResponse.type === EitherType.failure) {
    return firstDeleteUserNotificationForUserIdResponse;
  }

  const secondDeleteUserNotificationForUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
          publishedItemCommentId,
        },
        recipientUserId: postAuthorUserId,
      },
    );
  if (secondDeleteUserNotificationForUserIdResponse.type === EitherType.failure) {
    return secondDeleteUserNotificationForUserIdResponse;
  }

  //////////////////////////////////////////////////
  // GET COUNT OF UNREAD NOTIFICATIONS
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: postAuthorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // CANCEL NOTIFICATIONS
  //////////////////////////////////////////////////

  const unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPublishedItemNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_COMMENT_ON_PUBLISHED_ITEM,
      countOfUnreadNotifications,
      publishedItemCommentId: publishedItemCommentId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewCommentOnPost(
    {
      userId: postAuthorUserId,
      unrenderableCanceledCommentOnPostNotification,
    },
  );

  const unrenderableCanceledNewTagInPublishedItemCommentNotification: UnrenderableCanceledNewTagInPublishedItemCommentNotification =
    {
      type: NOTIFICATION_EVENTS.CANCELED_NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
      countOfUnreadNotifications,
      publishedItemCommentId: publishedItemCommentId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewTagInPublishedItemComment(
    {
      userId: postAuthorUserId,
      unrenderableCanceledNewTagInPublishedItemCommentNotification,
    },
  );

  return Success({});
}
