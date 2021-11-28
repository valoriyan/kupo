import express from "express";
import { RenderablePost } from "../models";
import { PostController } from "../postController";
import { HTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { getEncodedNextPageCursor, getPageOfPosts } from "./utilities";
import { constructRenderablePostsFromParts } from "../utilities";

export interface GetPageOfPostsPaginationParams {
  userId: string;

  cursor?: string;
  pageSize: number;
}

export interface SuccessfulGetPageOfPostsPaginationResponse {
  renderablePosts: RenderablePost[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPageOfPostsPaginationResponseReason {
  UnknownCause = "Unknown Cause",
  UserPrivate = "This User's Posts Are Private",
}

export interface FailedtoGetPageOfPostsPaginationResponse {
  reason: FailedtoGetPageOfPostsPaginationResponseReason;
}

export async function handleGetPageOfPostsPagination({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPageOfPostsPaginationParams;
}): Promise<
  HTTPResponse<
    FailedtoGetPageOfPostsPaginationResponse,
    SuccessfulGetPageOfPostsPaginationResponse
  >
> {
  const { clientUserId } = await checkAuthorization(controller, request);

  const canViewContent = await canUserViewUserContentByUserId({
    clientUserId,
    targetUserId: requestBody.userId,
    databaseService: controller.databaseService,
  });

  if (!canViewContent) {
    return {
      error: { reason: FailedtoGetPageOfPostsPaginationResponseReason.UserPrivate },
    };
  }

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCreatorUserId(
      {
        creatorUserId: requestBody.userId,
        filterOutExpiredAndUnscheduledPosts: true,
      },
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
  });

  return {
    success: {
      renderablePosts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedNextPageCursor({
        posts: filteredUnrenderablePostsWithoutElements,
      }),
    },
  };
}
