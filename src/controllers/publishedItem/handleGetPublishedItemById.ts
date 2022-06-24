import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./post/postController";
import express from "express";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "./post/models";
import { constructRenderablePostFromParts } from "./post/utilities";
import { PublishedItemType } from "./models";
import { RenderableShopItem } from "./shopItem/models";
import { constructRenderableShopItemFromParts } from "./shopItem/utilities";

export enum GetPublishedItemByIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPublishedItemByIdFailed {
  reason: GetPublishedItemByIdFailedReason;
}

export interface GetPublishedItemByIdSuccess {
  publishedItem: RenderablePost | RenderableShopItem;
}

export interface GetPublishedItemByIdRequestBody {
  publishedItemId: string;
}

export async function handleGetPublishedItemById({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPublishedItemByIdRequestBody;
}): Promise<SecuredHTTPResponse<GetPublishedItemByIdFailed, GetPublishedItemByIdSuccess>> {
  const { publishedItemId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const uncompiledBasePublishedItem =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: publishedItemId },
    );

  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    const post = await constructRenderablePostFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
    return {
      success: { publishedItem: post },
    };
  } else {
    const shopItem = await constructRenderableShopItemFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
    return {
      success: { publishedItem: shopItem },
    };

  }


}
