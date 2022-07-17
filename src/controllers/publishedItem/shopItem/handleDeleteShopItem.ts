import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteShopItemFailed {}

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
    ErrorReasonTypes<string | DeleteShopItemFailed>,
    DeleteShopItemSuccess
  >
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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

  const deleteShopItemResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemTableService.deleteShopItem(
      {
        controller,
        publishedItemId,
        authorUserId: clientUserId,
      },
    );
  if (deleteShopItemResponse.type === EitherType.failure) {
    return deleteShopItemResponse;
  }

  const deleteShopItemMediaElementsByPublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.deleteShopItemMediaElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
      },
    );
  if (deleteShopItemMediaElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return deleteShopItemMediaElementsByPublishedItemIdResponse;
  }
  const { success: blobPointers } = deleteShopItemMediaElementsByPublishedItemIdResponse;

  const deleteImagesResponse = await controller.blobStorageService.deleteImages({
    controller,
    blobPointers,
  });
  if (deleteImagesResponse.type === EitherType.failure) {
    return deleteImagesResponse;
  }

  return Success({});
}
