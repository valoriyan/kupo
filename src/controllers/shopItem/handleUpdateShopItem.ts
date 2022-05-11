import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateShopItemSuccess {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateShopItemFailed {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  shopItemId: string;
  description?: string;
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
}): Promise<SecuredHTTPResponse<UpdateShopItemSuccess, UpdateShopItemFailed>> {
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const {
    shopItemId,
    description,
    title,
    price,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.updateShopItemByShopItemId(
    {
      shopItemId: shopItemId,
      description: description,
      title: title,
      price: price,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp,
      expirationTimestamp: expirationTimestamp,
    },
  );

  return {};
}
