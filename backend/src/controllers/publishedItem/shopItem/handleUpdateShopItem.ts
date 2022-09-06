import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdateShopItemFailedReason>,
    UpdateShopItemSuccess
  >
> {
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

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  if (uncompiledBasePublishedItem.authorUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UpdateShopItemFailedReason.IllegalAccess,
      error: "Illegal access at handleUpdateShopItem",
      additionalErrorInformation: "Illegal access at handleUpdateShopItem",
    });
  }

  const updateShopItemByPublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemsTableService.updateShopItemByPublishedItemId(
      {
        controller,
        publishedItemId: uncompiledBasePublishedItem.id,
        description: description,
        title: title,
        price: price,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp,
        expirationTimestamp: expirationTimestamp,
      },
    );
  if (updateShopItemByPublishedItemIdResponse.type === EitherType.failure) {
    return updateShopItemByPublishedItemIdResponse;
  }

  return Success({});
}
