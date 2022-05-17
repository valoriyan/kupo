import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../post/models";
import {
  getPageOfPostsFromAllPosts,
} from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedHashtagRequestBody {
  hashtag: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfPostFromFollowedHashtagFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfPostFromFollowedHashtagFailed {
  reason: GetPageOfPostFromFollowedHashtagFailedReason;
}

export interface GetPageOfPostFromFollowedHashtagSuccess {
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
  requestBody: GetPageOfPostFromFollowedHashtagRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetPageOfPostFromFollowedHashtagFailed,
    GetPageOfPostFromFollowedHashtagSuccess
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, hashtag, pageSize } = requestBody;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const postIdsWithHashtag =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithHashtag(
      { hashtag: hashtag },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      {
        postIds: postIdsWithHashtag,
        limit: pageSize,
        getPostsBeforeTimestamp: pageTimestamp,
      },
    );

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
      ? encodeTimestampCursor({
          timestamp:
            renderablePosts[renderablePosts.length - 1].scheduledPublicationTimestamp,
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
