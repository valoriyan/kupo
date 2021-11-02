import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import {
  RenderablePost,
  UnrenderablePostWithoutElementsOrHashtags,
} from "../post/models";
import { getPageOfPosts } from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedHashtagParams {
  hashtag: string;
  cursor?: string;
  pageSize: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPageOfPostFromFollowedHashtagResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulGetPageOfPostFromFollowedHashtagResponse {
  posts: RenderablePost[];
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
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postIdsWithHashtag =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithHashtagId(
      { hashtag: requestBody.hashtag },
    );

  const unrenderablePostsWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags[] =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      { postIds: postIdsWithHashtag },
    );

  const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] =
    getPageOfPosts({
      unfilteredUnrenderablePostsWithoutElementsOrHashtags:
        unrenderablePostsWithoutElementsOrHashtags,
      encodedCursor: requestBody.cursor,
      pageSize: requestBody.pageSize,
    });

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    unrenderablePostsWithoutElementsOrHashtags: filteredUnrenderablePostsWithoutElements,
  });

  return {
    success: {
      posts: renderablePosts,
    },
  };
}
