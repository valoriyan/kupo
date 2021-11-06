import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToDeleteShopItemResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulShopItemDeletionResponse {}

export interface DeleteShopItemRequestBody {
  shopItemId: string;
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
  SecuredHTTPResponse<FailedToDeleteShopItemResponse, SuccessfulShopItemDeletionResponse>
> {
  const { shopItemId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.deleteShopItem(
    {
      shopItemId: requestBody.shopItemId,
      authorUserId: clientUserId,
    },
  );

  const blobPointers =
    await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.deleteShopItemMediaElementsByShopItemId(
      {
        shopItemId,
      },
    );

  await controller.blobStorageService.deleteImages({ blobPointers });

  return {};
}
