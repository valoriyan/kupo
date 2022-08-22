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
import { RenderableShopItem } from "./shopItem/models";
import { constructPublishedItemFromPartsById } from "./utilities/constructPublishedItemsFromParts";

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

  const constructPublishedItemFromPartsByIdResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      publishedItemId: publishedItemId,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;
  return Success({ publishedItem });
}
