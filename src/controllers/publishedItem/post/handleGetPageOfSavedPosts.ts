import express from "express";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemType } from "../models";
import { RenderablePost } from "./models";
import { getEncodedCursorOfNextPageOfSequentialItems } from "./pagination/utilities";
import { constructRenderablePostsFromParts } from "./utilities";
import { decodeTimestampCursor } from "../../utilities/pagination";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PostController } from "./postController";

export interface GetPageOfSavedPostsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface GetPageOfSavedPostsSuccess {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfSavedPostsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetPageOfSavedPosts({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPageOfSavedPostsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPageOfSavedPostsFailedReason>,
    GetPageOfSavedPostsSuccess
  >
> {
  const { cursor, pageSize } = requestBody;

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
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } = getPublishedItemsByIdsResponse;

  const uncompiledSavedPosts = uncompiledBasePublishedItems.filter(
    (uncompiledBasePublishedItem) =>
      uncompiledBasePublishedItem.type === PublishedItemType.POST,
  );

  const constructRenderablePostsFromPartsResponse =
    await constructRenderablePostsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: uncompiledSavedPosts,
      clientUserId,
    });
  if (constructRenderablePostsFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostsFromPartsResponse;
  }
  const { success: posts } = constructRenderablePostsFromPartsResponse;

  return Success({
    posts,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: posts,
    }),
  });
}
