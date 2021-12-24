import express from "express";
import { RenderablePost } from "../models";
import { PostController } from "../postController";
import { HTTPResponse } from "../../../types/httpResponse";
import { getClientUserId } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { getNextPageOfPostsEncodedCursor, getPageOfPostsFromAllPosts } from "./utilities";
import { constructRenderablePostsFromParts } from "../utilities";

export interface GetPageOfPostsPaginationParams {
  userId: string;

  cursor?: string;
  pageSize: number;
}

export interface SuccessfulGetPageOfPostsPaginationResponse {
  posts: RenderablePost[];

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
  const clientUserId = await getClientUserId(request);

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

  const filteredUnrenderablePostsWithoutElements = getPageOfPostsFromAllPosts({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: requestBody.cursor,
    pageSize: requestBody.pageSize,
  });

  const posts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: filteredUnrenderablePostsWithoutElements,
    clientUserId,
  });

  return {
    success: {
      posts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getNextPageOfPostsEncodedCursor({
        posts: filteredUnrenderablePostsWithoutElements,
      }),
    },
  };
}
