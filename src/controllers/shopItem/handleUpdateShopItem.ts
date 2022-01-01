import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulShopItemUpdateResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdateShopItemResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  shopItemId: string;
  caption?: string;
  title?: string;
  price?: number;
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
  collaboratorUserIds?: string[];
  hashtags?: string[];
  mediaFiles?: Express.Multer.File[];
}

export async function handleUpdateShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<SuccessfulShopItemUpdateResponse, FailedToUpdateShopItemResponse>
> {
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.updateShopItemByShopItemId(
    {
      shopItemId: requestBody.shopItemId,
      caption: requestBody.caption,
      title: requestBody.title,
      price: requestBody.price,
      scheduledPublicationTimestamp: requestBody.scheduledPublicationTimestamp,
      expirationTimestamp: requestBody.expirationTimestamp,
    },
  );

  return {};
}
