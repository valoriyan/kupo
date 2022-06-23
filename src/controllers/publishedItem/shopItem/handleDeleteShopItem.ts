import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
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
}): Promise<SecuredHTTPResponse<DeleteShopItemFailed, DeleteShopItemSuccess>> {
  const { publishedItemId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.deleteShopItem(
    {
      publishedItemId,
      authorUserId: clientUserId,
    },
  );

  const blobPointers =
    await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.deleteShopItemMediaElementsByPublishedItemId(
      {
        publishedItemId,
      },
    );

  await controller.blobStorageService.deleteImages({ blobPointers });

  return {};
}