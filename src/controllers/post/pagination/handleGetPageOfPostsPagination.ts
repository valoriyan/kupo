import express from "express";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "../models";
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
  // needs to filter out posts by expiration and scheduled publication timestamp
  // check if requesting user is allowed to view posts - 403

  const { clientUserId, error } = await checkAuthorization(controller, request);

  if (error) {
    return {
      error: {
        reason: FailedtoGetPageOfPostsPaginationResponseReason.UnknownCause,
      },
    };
  }

  const canViewContent = await canUserViewUserContentByUserId({
    clientUserId,
    targetUserId: requestBody.userId,
    databaseService: controller.databaseService,
  });

  if (!canViewContent) {
    return {
      error: {
        reason: FailedtoGetPageOfPostsPaginationResponseReason.UnknownCause,
      },
    };
  }

  const unrenderablePostsWithoutElements =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCreatorUserId(
      {
        creatorUserId: requestBody.userId,
      },
    );

    const filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[] = getPageOfPosts({
      unfilteredUnrenderablePostsWithoutElementsOrHashtags: unrenderablePostsWithoutElements,
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
      renderablePosts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedNextPageCursor({ renderablePosts }),
    },
  };
}
