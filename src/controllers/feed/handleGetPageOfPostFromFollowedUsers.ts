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

export interface GetPageOfPostFromFollowedUsersParams {
  cursor?: string;
  pageSize: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPostsFromFollowedUsersResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulGetPostsFromFollowedUsersResponse {
  posts: RenderablePost[];
}

export async function handleGetPageOfPostFromFollowedUsers({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPageOfPostFromFollowedUsersParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPostsFromFollowedUsersResponse,
    SuccessfulGetPostsFromFollowedUsersResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userIdsBeingFollowed: string[] =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { userIdDoingFollowing: clientUserId },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCreatorUserIds(
      { creatorUserIds: userIdsBeingFollowed },
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
