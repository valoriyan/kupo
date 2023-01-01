import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../publishedItem/models";
import { getPageOfPublishedItemsFromAllPublishedItems } from "../publishedItem/utilities/pagination";
import { assemblePublishedItemsFromCachedComponents } from "../publishedItem/utilities/assemblePublishedItems";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

export interface GetPublishedItemsFromFollowedHashtagRequestBody {
  hashtag: string;
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export enum GetPublishedItemsFromFollowedHashtagFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPublishedItemsFromFollowedHashtagSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPublishedItemsFromFollowedHashtag({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPublishedItemsFromFollowedHashtagRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsFromFollowedHashtagFailedReason>,
    GetPublishedItemsFromFollowedHashtagSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { cursor, hashtag, pageSize, publishedItemType } = requestBody;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Read Matching Published Items Ids from DB
  //////////////////////////////////////////////////

  const getPublishedItemsWithHashtagResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.getPublishedItemsWithHashtag(
      { controller, hashtag: hashtag },
    );
  if (getPublishedItemsWithHashtagResponse.type === EitherType.failure) {
    return getPublishedItemsWithHashtagResponse;
  }
  const { success: publishedItemIdsWithHashtag } = getPublishedItemsWithHashtagResponse;

  //////////////////////////////////////////////////
  // Read Published Item Ids from DB
  //////////////////////////////////////////////////

  const getPublishedItemsByIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        controller,
        ids: publishedItemIdsWithHashtag,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
        restrictedToType: publishedItemType,
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemsByIdsResponse;

  //////////////////////////////////////////////////
  // Generate Page of Published Items
  //////////////////////////////////////////////////

  const pageOfUncompiledBasePublishedItem = getPageOfPublishedItemsFromAllPublishedItems({
    uncompiledBasePublishedItems: uncompiledBasePublishedItem,
    encodedCursor: cursor,
    pageSize: pageSize,
  });

  //////////////////////////////////////////////////
  // Assemble Published Items
  //////////////////////////////////////////////////

  const assemblePublishedItemsFromCachedComponentsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: pageOfUncompiledBasePublishedItem,
      requestorUserId: clientUserId,
    });
  if (assemblePublishedItemsFromCachedComponentsResponse.type === EitherType.failure) {
    return assemblePublishedItemsFromCachedComponentsResponse;
  }
  const { success: renderablePublishedItems } =
    assemblePublishedItemsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Generate Next-Page Cursor
  //////////////////////////////////////////////////

  const nextPageCursor =
    renderablePublishedItems.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePublishedItems[renderablePublishedItems.length - 1]
              .scheduledPublicationTimestamp,
        })
      : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
