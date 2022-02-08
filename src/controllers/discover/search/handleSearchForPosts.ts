import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { RenderablePost } from "../../post/models";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import {
  encodeCursor,
  getPageOfPostsFromAllPosts,
} from "../../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../../post/utilities";

export interface SearchForPostsParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum SearchForPostsFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForPostsFailed {
  reason: SearchForPostsFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForPostsSuccess {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleSearchForPosts({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForPostsParams;
}): Promise<SecuredHTTPResponse<SearchForPostsFailed, SearchForPostsSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query } = requestBody;
  const trimmedQuery = query.trim();

  const postIdsWithPossibleHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithOneOfHashtags(
      { hashtagSubstring: trimmedQuery },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      { postIds: postIdsWithPossibleHashtags },
    );

  if (unrenderablePostsWithoutElementsOrHashtags.length === 0) {
    // controller.setStatus(404);
    return {
      success: {
        posts: [],
        previousPageCursor: cursor,
      },
    };
  }

  const filteredUnrenderablePostsWithoutElements = getPageOfPostsFromAllPosts({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: requestBody.cursor,
    pageSize: requestBody.pageSize,
  });

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: filteredUnrenderablePostsWithoutElements,
    clientUserId,
  });

  const nextPageCursor =
    renderablePosts.length > 0
      ? encodeCursor({
          timestamp:
            renderablePosts[renderablePosts.length - 1]!.scheduledPublicationTimestamp,
        })
      : undefined;

  return {
    success: {
      posts: renderablePosts,
      previousPageCursor: cursor,
      nextPageCursor,
    },
  };
}
