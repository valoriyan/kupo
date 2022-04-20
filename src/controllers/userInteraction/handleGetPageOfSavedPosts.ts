import express from "express";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../post/models";
import {
  decodeCursor,
  getNextPageOfPostsEncodedCursor,
} from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { SecuredHTTPResponse } from "./../../../src/types/httpResponse";
import { SavedItemType } from "./models";
import { UserInteractionController } from "./userInteractionController";

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
  controller: UserInteractionController;
  request: express.Request;
  requestBody: GetPageOfSavedPostsRequestBody;
}): Promise<SecuredHTTPResponse<GetPageOfSavedPostsFailed, GetPageOfSavedPostsSuccess>> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeCursor({ encodedCursor: cursor })
    : 999999999999999;

  const db_saved_items =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.getSavedItemsByUserId(
      {
        userId: clientUserId,
        limit: pageSize,
        getItemsSavedBeforeTimestamp: pageTimestamp,
      },
    );

  const postIds = db_saved_items
    .filter(({ item_type }) => item_type === SavedItemType.post)
    .map(({ item_id }) => item_id);

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      {
        postIds,
      },
    );

  const posts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: unrenderablePostsWithoutElementsOrHashtags,
    clientUserId,
  });

  return {
    success: {
      posts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getNextPageOfPostsEncodedCursor({
        posts: unrenderablePostsWithoutElementsOrHashtags,
      }),
    },
  };
}
