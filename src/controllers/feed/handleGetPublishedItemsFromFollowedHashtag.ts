import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../publishedItem/models";
import { getPageOfPublishedItemsFromAllPublishedItems } from "../publishedItem/post/pagination/utilities";
import { constructPublishedItemsFromParts } from "../publishedItem/utilities";
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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { cursor, hashtag, pageSize, publishedItemType } = requestBody;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const getPublishedItemsWithHashtagResponse =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPublishedItemsWithHashtag(
      { controller, hashtag: hashtag },
    );
  if (getPublishedItemsWithHashtagResponse.type === EitherType.failure) {
    return getPublishedItemsWithHashtagResponse;
  }
  const { success: postIdsWithHashtag } = getPublishedItemsWithHashtagResponse;

  const getPublishedItemsByIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        controller,
        ids: postIdsWithHashtag,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
        restrictedToType: publishedItemType,
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: unrenderablePostsWithoutElementsOrHashtags } =
    getPublishedItemsByIdsResponse;

  const filteredUnrenderablePostsWithoutElements = getPageOfPublishedItemsFromAllPublishedItems({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: cursor,
    pageSize: pageSize,
  });

  const constructPublishedItemsFromPartsResponse =
    await constructPublishedItemsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: filteredUnrenderablePostsWithoutElements,
      clientUserId,
    });
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePublishedItems } = constructPublishedItemsFromPartsResponse;

  const nextPageCursor =
    renderablePublishedItems.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePublishedItems[renderablePublishedItems.length - 1].scheduledPublicationTimestamp,
        })
      : undefined;

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
