import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateShopItemSuccess {}

export enum UpdateShopItemFailedReason {
  IllegalAccess = "Illegal Access",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  publishedItemId: string;
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
}): Promise<SecuredHTTPResponse<UpdateShopItemFailedReason, UpdateShopItemSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const {
    publishedItemId,
    description,
    title,
    price,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  const uncompiledBasePublishedItem =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: publishedItemId },
    );

  if (uncompiledBasePublishedItem.authorUserId !== clientUserId) {
    return {
      error: {
        reason: UpdateShopItemFailedReason.IllegalAccess,
      },
    };
  }

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.updateShopItemByPublishedItemId(
    {
      publishedItemId: uncompiledBasePublishedItem.id,
      description: description,
      title: title,
      price: price,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp,
      expirationTimestamp: expirationTimestamp,
    },
  );

  return {};
}
