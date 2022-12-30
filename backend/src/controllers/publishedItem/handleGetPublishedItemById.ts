import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { PostController } from "./post/postController";
import express from "express";
import { checkAuthentication } from "../auth/utilities";
import { RenderablePost } from "./post/models";
import { RenderableShopItem } from "./shopItem/models";
import { assemblePublishedItemById } from "./utilities/assemblePublishedItems";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Assemble Published Item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsByIdResponse = await assemblePublishedItemById({
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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ publishedItem });
}
