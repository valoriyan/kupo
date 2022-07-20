import express from "express";
import { checkAuthorization } from "../auth/utilities";
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
import { constructPublishedItemsFromParts } from "./utilities/constructPublishedItemsFromParts";

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
  const { cursor, pageSize, publishedItemType } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

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

  const getPublishedItemsByIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        controller,
        ids: publishedItemIds,
        restrictedToType: publishedItemType,
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } = getPublishedItemsByIdsResponse;

  const constructPublishedItemsFromPartsResponse = await constructPublishedItemsFromParts(
    {
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      clientUserId,
    },
  );
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePublishedItems } = constructPublishedItemsFromPartsResponse;

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: renderablePublishedItems,
    }),
  });
}
