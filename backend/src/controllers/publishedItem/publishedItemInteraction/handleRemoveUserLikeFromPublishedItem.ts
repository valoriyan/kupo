import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";
import { assembleRecordAndSendCanceledNewLikeOnPublishedItemNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledNewLikeOnPublishedItemNotification";

export interface RemoveUserLikeFromPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveUserLikeFromPublishedItemSuccess {}

export enum RemoveUserLikeFromPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleRemoveUserLikeFromPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: RemoveUserLikeFromPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | RemoveUserLikeFromPublishedItemFailedReason>,
    RemoveUserLikeFromPublishedItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Delete Like From DB
  //////////////////////////////////////////////////

  const removePublishedItemLikeByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.removePublishedItemLikeByUserId(
      {
        controller,
        publishedItemId,
        userId: clientUserId,
      },
    );
  if (removePublishedItemLikeByUserIdResponse.type === EitherType.failure) {
    return removePublishedItemLikeByUserIdResponse;
  }
  const {
    success: { published_item_like_id },
  } = removePublishedItemLikeByUserIdResponse;

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
    success: { authorUserId },
  } = getPublishedItemByIdResponse;

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////

  await assembleRecordAndSendCanceledNewLikeOnPublishedItemNotification({
    controller,
    userIdUnlikingPost: clientUserId,
    publishedItemId,
    publishedItemLikeId: published_item_like_id,
    recipientUserId: authorUserId,
    databaseService: controller.databaseService,
    webSocketService: controller.webSocketService,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
