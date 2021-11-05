import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../post/models";
import { getPageOfPosts } from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedHashtagParams {
  hashtag: string;
  cursor?: string;
  pageSize: number;
  userTimeZone: string;
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
  const { userTimeZone } = requestBody;

  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postIdsWithHashtag =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPostIdsWithHashtagId(
      { hashtag: requestBody.hashtag },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByPostIds(
      { postIds: postIdsWithHashtag },
    );

  const filteredUnrenderablePostsWithoutElements = getPageOfPosts({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: requestBody.cursor,
    pageSize: requestBody.pageSize,
  });

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: filteredUnrenderablePostsWithoutElements,
    userTimeZone,
  });

  return {
    success: {
      posts: renderablePosts,
    },
  };
}