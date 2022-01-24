import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { RenderablePost } from "../../../controllers/post/models";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../../controllers/auth/utilities";
import {
  encodeCursor,
  getPageOfPostsFromAllPosts,
} from "../../../controllers/post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../../../controllers/post/utilities";

export interface GetPageOfDiscoverSearchResultsForPostsParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum FailedToGetPageOfDiscoverSearchResultsForPostsResponseReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPageOfDiscoverSearchResultsForPostsResponse {
  reason: FailedToGetPageOfDiscoverSearchResultsForPostsResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyGotPageOfDiscoverSearchResultsForPostsResponse {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfDiscoverSearchResultsForPosts({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetPageOfDiscoverSearchResultsForPostsParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForPostsResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForPostsResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query } = requestBody;

  const trimmedQuery = query.trim();
  const possibleSubEntries = trimmedQuery.split(" ");

  const postIdsWithPossibleHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithOneOfHashtags(
      { hashtags: possibleSubEntries },
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
