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

export interface SearchForPostCaptionsParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum SearchForPostCaptionsFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForPostCaptionsFailed {
  reason: SearchForPostCaptionsFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForPostCaptionsSuccess {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleSearchForPostCaptions({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForPostCaptionsParams;
}): Promise<
  SecuredHTTPResponse<SearchForPostCaptionsFailed, SearchForPostCaptionsSuccess>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query } = requestBody;

  const trimmedQuery = query.trim();

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCaptionMatchingSubstring(
      { captionSubstring: trimmedQuery },
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
