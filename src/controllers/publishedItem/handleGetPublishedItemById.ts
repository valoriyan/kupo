import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemByIdFailedReason>,
    GetPublishedItemByIdSuccess
  >
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    const constructRenderablePostFromPartsResponse =
      await constructRenderablePostFromParts({
        controller,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      });
    if (constructRenderablePostFromPartsResponse.type === EitherType.failure) {
      return constructRenderablePostFromPartsResponse;
    }
    const { success: post } = constructRenderablePostFromPartsResponse;

    return Success({ publishedItem: post });
  } else {
    const constructRenderableShopItemFromPartsResponse =
      await constructRenderableShopItemFromParts({
        controller,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      });
    if (constructRenderableShopItemFromPartsResponse.type === EitherType.failure) {
      return constructRenderableShopItemFromPartsResponse;
    }
    const { success: shopItem } = constructRenderableShopItemFromPartsResponse;

    return Success({ publishedItem: shopItem });
  }
}
