/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { deleteBaseRenderablePublishedItemComponents } from "../utilities/deleteBasePublishedItemComponents";
import { ShopItemController } from "./shopItemController";

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
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // DELETE BASE PUBLISHED ITEMs
  //////////////////////////////////////////////////
  const deleteBaseRenderablePublishedItemComponentsResponse =
    await deleteBaseRenderablePublishedItemComponents({
      controller,
      databaseService: controller.databaseService,
      publishedItemId,
      requestingUserId: clientUserId,
    });
  if (deleteBaseRenderablePublishedItemComponentsResponse.type === EitherType.failure) {
    return deleteBaseRenderablePublishedItemComponentsResponse;
  }

  //////////////////////////////////////////////////
  // DELETE REMAINING SHOP ITEM
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
  // DELETE ASSOCIATED BLOB FILES
  //////////////////////////////////////////////////
  const deleteAssociatedBlobFilesForShopItemResponse =
    await deleteAssociatedBlobFilesForShopItem({
      controller,
      databaseService: controller.databaseService,
      blobStorageService: controller.blobStorageService,
      publishedItemId,
    });
  if (deleteAssociatedBlobFilesForShopItemResponse.type === EitherType.failure) {
    return deleteAssociatedBlobFilesForShopItemResponse;
  }

  return Success({});
}

const deleteAssociatedBlobFilesForShopItem = async ({
  controller,
  databaseService,
  blobStorageService,
  publishedItemId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  publishedItemId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  const deleteShopItemMediaElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.deleteShopItemMediaElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
      },
    );
  if (deleteShopItemMediaElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return deleteShopItemMediaElementsByPublishedItemIdResponse;
  }
  const { success: blobPointers } = deleteShopItemMediaElementsByPublishedItemIdResponse;

  const deleteImagesResponse = await blobStorageService.deleteImages({
    controller,
    blobPointers,
  });
  if (deleteImagesResponse.type === EitherType.failure) {
    return deleteImagesResponse;
  }

  return Success({});
};
