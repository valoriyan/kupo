import express from "express";
import {
  RenderablePost,
  UnrenderablePostWithoutElementsOrHashtags,
} from "../models";
import { PostController } from "../postController";
import { Promise as BluebirdPromise } from "bluebird";
import { HTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { getEncodedNextPageCursor } from "./utilities";

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
    await controller.databaseService.tableServices.postsTableService.getPostsByCreatorUserId(
      {
        creatorUserId: requestBody.userId,
      },
    );

  // For simplicity, we are returning posts ordered by timestamp
  // However, we will want to return posts with the highest clickthrough rate (or some other criterion)
  let filteredUnrenderablePostsWithoutElements: UnrenderablePostWithoutElementsOrHashtags[];
  if (!!requestBody.cursor) {
    const decodedCursor = Number(
      Buffer.from(requestBody.cursor, "base64").toString("binary"),
    );

    filteredUnrenderablePostsWithoutElements = unrenderablePostsWithoutElements
      .filter((unrenderablePostWithoutElements) => {
        return (
          unrenderablePostWithoutElements.scheduledPublicationTimestamp > decodedCursor
        );
      })
      .slice(-requestBody.pageSize);
  } else {
    filteredUnrenderablePostsWithoutElements = unrenderablePostsWithoutElements.slice(
      -requestBody.pageSize,
    );
  }

  const renderablePosts = await BluebirdPromise.map(
    filteredUnrenderablePostsWithoutElements,
    async (unrenderablePostWithoutElements): Promise<RenderablePost> => {
      const filedPostContentElements =
        await controller.databaseService.tableServices.postContentElementsTableService.getPostContentElementsByPostId(
          {
            postId: unrenderablePostWithoutElements.postId,
          },
        );

      const contentElementTemporaryUrls: string[] =
        await BluebirdPromise.map(
          filedPostContentElements,
          async (filedPostContentElement): Promise<string> => {
            const fileTemporaryUrl =
              await controller.blobStorageService.getTemporaryImageUrl({
                blobItemPointer: {
                  fileKey: filedPostContentElement.blobFileKey,
                },
              });

            return fileTemporaryUrl;
          },
        );

      return {
        ...unrenderablePostWithoutElements,
        contentElementTemporaryUrls,
        hashtags: [],
      };
    },
  );

  return {
    success: {
      renderablePosts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedNextPageCursor({ renderablePosts }),
    },
  };
}
