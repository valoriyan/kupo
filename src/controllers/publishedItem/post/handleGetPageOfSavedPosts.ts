import express from "express";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemType } from "../models";
import { RenderablePost } from "./models";
import { getEncodedCursorOfNextPageOfSequentialItems } from "./pagination/utilities";
import { constructRenderablePostsFromParts } from "./utilities";
import { decodeTimestampCursor } from "../../utilities/pagination";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
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

export interface GetPageOfSavedPostsFailed {
  reason: GetPageOfSavedPostsFailedReason;
}

export async function handleGetPageOfSavedPosts({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPageOfSavedPostsRequestBody;
}): Promise<SecuredHTTPResponse<GetPageOfSavedPostsFailed, GetPageOfSavedPostsSuccess>> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const db_saved_items =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.getSavedItemsByUserId(
      {
        userId: clientUserId,
        limit: pageSize,
        getItemsSavedBeforeTimestamp: pageTimestamp,
      },
    );

  const publishedItemIds = db_saved_items.map(
    (db_saved_item) => db_saved_item.published_item_id,
  );

  const uncompiledBasePublishedItems =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        ids: publishedItemIds,
      },
    );

  const uncompiledSavedPosts = uncompiledBasePublishedItems.filter(
    (uncompiledBasePublishedItem) =>
      uncompiledBasePublishedItem.type === PublishedItemType.POST,
  );

  const posts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems: uncompiledSavedPosts,
    clientUserId,
  });

  return {
    success: {
      posts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
        sequentialFeedItems: posts,
      }),
    },
  };
}
