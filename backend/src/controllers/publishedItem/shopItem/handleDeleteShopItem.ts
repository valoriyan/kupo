/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { ShopItemController } from "./shopItemController";
import { assembleRecordAndSendCanceledNewShareOfPublishedItemNotification } from "../../../controllers/notification/notificationSenders/cancelledNotifications/assembleRecordAndSendCanceledNewShareOfPublishedItemNotification";

export enum DeleteShopItemFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteShopItemSuccess {}

export interface DeleteShopItemRequestBody {
  publishedItemId: string;
}

export async function handleDeleteShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: DeleteShopItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | DeleteShopItemFailedReason>,
    DeleteShopItemSuccess
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
  // Handle Notifications
  //////////////////////////////////////////////////
  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePublishedItemBeingDeleted } = getPublishedItemByIdResponse;

  if (!!unrenderablePublishedItemBeingDeleted.idOfPublishedItemBeingShared) {
    const getPublishedItemByIdSecondResponse =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          controller,
          id: unrenderablePublishedItemBeingDeleted.idOfPublishedItemBeingShared,
        },
      );

    if (getPublishedItemByIdSecondResponse.type === EitherType.failure) {
      return getPublishedItemByIdSecondResponse;
    }
    const { success: unrenderablePublishedItemThatWasShared } =
      getPublishedItemByIdSecondResponse;

    assembleRecordAndSendCanceledNewShareOfPublishedItemNotification({
      controller,
      userIdNoLongerSharingPublishedItem: clientUserId,
      deletedPublishedItemId: unrenderablePublishedItemBeingDeleted.id,
      recipientUserId: unrenderablePublishedItemThatWasShared.authorUserId,
      databaseService: controller.databaseService,
      webSocketService: controller.webSocketService,
    });
  }

  //////////////////////////////////////////////////
  // Delete From DB
  //////////////////////////////////////////////////
  const deletePublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.deletePublishedItem(
      {
        controller,
        id: publishedItemId,
        authorUserId: clientUserId,
      },
    );
  if (deletePublishedItemResponse.type === EitherType.failure) {
    return deletePublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Delete Associated Shop Item From DB
  //////////////////////////////////////////////////

  const deleteShopItemResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemsTableService.deleteShopItem(
      {
        controller,
        publishedItemId,
        authorUserId: clientUserId,
      },
    );
  if (deleteShopItemResponse.type === EitherType.failure) {
    return deleteShopItemResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
