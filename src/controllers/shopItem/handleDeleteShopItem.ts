import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
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
  console.log("controller", controller);
  console.log("request", request);
  console.log("requestBody", requestBody);

  return {};
}
