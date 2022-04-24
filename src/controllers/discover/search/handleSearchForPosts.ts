import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { RenderablePost } from "../../post/models";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import {
  encodeCursor,
  getPageOfPostsFromAllPosts,
} from "../../post/pagination/utilities";
import {
  constructRenderablePostsFromParts,
  mergeArraysOfUnrenderablePostWithoutElementsOrHashtags,
} from "../../post/utilities";

export interface SearchForPostsRequestBody {
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
  requestBody: SearchForPostsRequestBody;
}): Promise<SecuredHTTPResponse<SearchForPostsFailed, SearchForPostsSuccess>> {
  const { cursor, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postIdsWithPossibleHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithOneOfHashtags(
      { hashtagSubstring: lowercaseTrimmedQuery },
    );

  const unrenderableHashtagMatchingPosts =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      { postIds: postIdsWithPossibleHashtags },
    );

  const unrenderableCaptionMatchingPosts =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCaptionMatchingSubstring(
      { captionSubstring: lowercaseTrimmedQuery },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    mergeArraysOfUnrenderablePostWithoutElementsOrHashtags({
      arrays: [unrenderableHashtagMatchingPosts, unrenderableCaptionMatchingPosts],
    });

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
    encodedCursor: cursor,
    pageSize: pageSize,
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
