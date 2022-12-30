import express from "express";
import { checkAuthentication } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "./models";
import { getEncodedCursorOfNextPageOfSequentialItems } from "./utilities/pagination";
import { decodeTimestampCursor } from "../utilities/pagination";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { PostController } from "./post/postController";
import { assemblePublishedItemsByIds } from "./utilities/assemblePublishedItems";

export interface GetSavedPublishedItemsRequestBody {
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export interface GetSavedPublishedItemsSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetSavedPublishedItemsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetSavedPublishedItems({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetSavedPublishedItemsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetSavedPublishedItemsFailedReason>,
    GetSavedPublishedItemsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { cursor, pageSize, publishedItemType } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Get Page of Saved Published Items
  //////////////////////////////////////////////////

  const getSavedItemsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.getSavedItemsByUserId(
      {
        controller,
        userId: clientUserId,
        limit: pageSize,
        getItemsSavedBeforeTimestamp: pageTimestamp,
      },
    );
  if (getSavedItemsByUserIdResponse.type === EitherType.failure) {
    return getSavedItemsByUserIdResponse;
  }
  const { success: db_saved_items } = getSavedItemsByUserIdResponse;

  const publishedItemIds = db_saved_items.map(
    (db_saved_item) => db_saved_item.published_item_id,
  );

  //////////////////////////////////////////////////
  // Assemble Published Items
  //////////////////////////////////////////////////

  const constructPublishedItemsFromPartsByIdResponse = await assemblePublishedItemsByIds({
    controller,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    publishedItemIds,
    requestorUserId: clientUserId,
    restrictedToType: publishedItemType,
  });

  if (constructPublishedItemsFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsByIdResponse;
  }
  const { success: renderablePublishedItems } =
    constructPublishedItemsFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: renderablePublishedItems,
    }),
  });
}
