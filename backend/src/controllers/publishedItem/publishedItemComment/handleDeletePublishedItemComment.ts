/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { GenericResponseFailedReason } from "../../models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { assembleRecordAndSendCancelledNewCommentOnPublishedItemNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCancelledNewCommentOnPublishedItemNotification";
import { assembleRecordAndSendCancelledNewTagInPublishedItemCommentNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCancelledNewTagInPublishedItemCommentNotification";
import { collectTagsFromText } from "../../../controllers/utilities/collectTagsFromText";
import { Promise as BluebirdPromise } from "bluebird";

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
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishedItemCommentId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Unrenderable Comment
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
  const { publishedItemId, text: commentText } = maybeUnrenderablePublishedItemComment;

  //////////////////////////////////////////////////
  // Get Published Item
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
  // Delete Comment from DB
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
  // Cancel New Comment Notification
  //////////////////////////////////////////////////
  const handleDeletePublishedItemCommentNotificationsResponse =
    await assembleRecordAndSendCancelledNewCommentOnPublishedItemNotification({
      controller,
      databaseService: controller.databaseService,
      webSocketService: controller.webSocketService,
      publishedItemCommentId,
      recipientUserId: postAuthorUserId,
    });

  if (handleDeletePublishedItemCommentNotificationsResponse.type === EitherType.failure) {
    return handleDeletePublishedItemCommentNotificationsResponse;
  }

  //////////////////////////////////////////////////
  // Collect Unrenderable Users Tagged in Comment
  //////////////////////////////////////////////////
  const taggedUsernames = collectTagsFromText({ text: commentText });

  const unrenderableUsersResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      {
        controller,
        usernames: taggedUsernames,
      },
    );

  if (unrenderableUsersResponse.type === EitherType.failure) {
    return unrenderableUsersResponse;
  }
  const { success: unrenderableUsers } = unrenderableUsersResponse;

  const userIdsTaggedInDeletedComment = unrenderableUsers.map(({ userId }) => userId);

  //////////////////////////////////////////////////
  // Cancel New Tag in Comment Notifications
  //////////////////////////////////////////////////
  await BluebirdPromise.map(
    userIdsTaggedInDeletedComment,
    async (
      userIdTaggedInDeletedComment,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
      return await assembleRecordAndSendCancelledNewTagInPublishedItemCommentNotification(
        {
          controller,
          databaseService: controller.databaseService,
          webSocketService: controller.webSocketService,
          publishedItemCommentId,
          recipientUserId: userIdTaggedInDeletedComment,
        },
      );
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
