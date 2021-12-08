import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../post/models";
import { getPageOfPosts } from "../post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../post/utilities";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedUsersParams {
  cursor?: string;
  pageSize: number;
}

export enum FailedToGetPageOfPostFromFollowedUsersResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedToGetPageOfPostFromFollowedUsersResponse {
  reason: FailedToGetPageOfPostFromFollowedUsersResponseReason;
}

export interface SuccessfulGetPageOfPostFromFollowedUsersResponse {
  posts: RenderablePost[];

  previousPageCursor?: string;
  nextPageCursor?: string;
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
    FailedToGetPageOfPostFromFollowedUsersResponse,
    SuccessfulGetPageOfPostFromFollowedUsersResponse
  >
> {
  const { pageSize, cursor } = requestBody;

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

  const filteredUnrenderablePostsWithoutElements = getPageOfPosts({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: cursor,
    pageSize: requestBody.pageSize,
  });

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: filteredUnrenderablePostsWithoutElements,
  });

  console.log("page size", pageSize);

  return {
    success: {
      posts: renderablePosts,
      previousPageCursor: undefined,
      nextPageCursor: cursor,
    },
  };
}
