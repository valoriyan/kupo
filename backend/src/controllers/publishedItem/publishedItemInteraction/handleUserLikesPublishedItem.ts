import { v4 as uuidv4 } from "uuid";
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";
import { assemblePublishedItemById } from "../utilities/assemblePublishedItems";
import { assembleRecordAndSendNewLikeOnPublishedItemNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewLikeOnPublishedItemNotification";

export interface UserLikesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserLikesPublishedItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum UserLikesPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUserLikesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserLikesPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UserLikesPublishedItemFailedReason>,
    UserLikesPublishedItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const now = Date.now();

  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const publishedItemLikeId = uuidv4();

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const createPublishedItemLikeFromUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.createPublishedItemLikeFromUserId(
      {
        controller,
        publishedItemLikeId: publishedItemLikeId,
        publishedItemId,
        userId: clientUserId,
        timestamp: now,
      },
    );

  if (createPublishedItemLikeFromUserIdResponse.type === EitherType.failure) {
    return createPublishedItemLikeFromUserIdResponse;
  }

  //////////////////////////////////////////////////
  // Assemble the Renderable Published Item
  //////////////////////////////////////////////////

  const assemblePublishedItemByIdResponse = await assemblePublishedItemById({
    controller,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    publishedItemId,
    requestorUserId: clientUserId,
  });

  if (assemblePublishedItemByIdResponse.type === EitherType.failure) {
    return assemblePublishedItemByIdResponse;
  }
  const { success: publishedItem } = assemblePublishedItemByIdResponse;

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////

  await assembleRecordAndSendNewLikeOnPublishedItemNotification({
    controller,
    publishedItem,
    publishedItemLikeId,
    userIdThatLikedPublishedItem: clientUserId,
    recipientUserId: publishedItem.authorUserId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
