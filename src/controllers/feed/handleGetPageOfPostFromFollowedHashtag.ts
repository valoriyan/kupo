import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../post/models";
import { encodeCursor, getPageOfPostsFromAllPosts } from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedHashtagParams {
  hashtag: string;
  cursor?: string;
  pageSize: number;
}

export enum FailedToGetPageOfPostFromFollowedHashtagResponseReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPageOfPostFromFollowedHashtagResponse {
  reason: FailedToGetPageOfPostFromFollowedHashtagResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulGetPageOfPostFromFollowedHashtagResponse {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfPostFromFollowedHashtag({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPageOfPostFromFollowedHashtagParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPageOfPostFromFollowedHashtagResponse,
    SuccessfulGetPageOfPostFromFollowedHashtagResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor } = requestBody;

  const postIdsWithHashtag =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithHashtagId(
      { hashtag: requestBody.hashtag },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      { postIds: postIdsWithHashtag },
    );

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
