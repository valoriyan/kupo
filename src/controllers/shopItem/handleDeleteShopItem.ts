import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToDeleteShopItemResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulShopItemDeletionResponse {}

interface HandlerRequestBody {
  shopItemId: string;
}

export async function handleDeleteShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<FailedToDeleteShopItemResponse, SuccessfulShopItemDeletionResponse>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableServices.shopItemTableService.deleteShopItem({
    shopItemId: requestBody.shopItemId,
    authorUserId: clientUserId,
  });

  return {};
}
