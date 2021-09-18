import express from "express";
import { RenderablePost, RenderablePostContentElement } from "./models";
import { PostController } from "./postController";
import { Promise as BluebirdPromise } from "bluebird";
import { HTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { canUserViewUserContentByUserId } from "../auth/utilities/canUserViewUserContent";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPageOfPostsPaginationParams {
  userId: string;
}

export interface SuccessfulGetPageOfPostsPaginationResponse {
  renderablePosts: RenderablePost[];
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
  // needs to be paginated (limit, offset)
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

  const renderablePosts = await BluebirdPromise.map(
    unrenderablePostsWithoutElements,
    async (unrenderablePostWithoutElements): Promise<RenderablePost> => {
      const filedPostContentElements =
        await controller.databaseService.tableServices.postContentElementsTableService.getPostContentElementsByPostId(
          {
            postId: unrenderablePostWithoutElements.postId,
          },
        );

      const renderablePostContentElements: RenderablePostContentElement[] =
        await BluebirdPromise.map(
          filedPostContentElements,
          async (filedPostContentElement): Promise<RenderablePostContentElement> => {
            const fileTemporaryUrl =
              await controller.blobStorageService.getTemporaryImageUrl({
                blobItemPointer: {
                  fileKey: filedPostContentElement.blobFileKey,
                },
              });

            return {
              fileType: filedPostContentElement.fileType,
              fileTemporaryUrl,
            };
          },
        );

      return {
        contentElements: renderablePostContentElements,

        postId: unrenderablePostWithoutElements.postId,
        postAuthorUserId: unrenderablePostWithoutElements.postAuthorUserId,
        caption: unrenderablePostWithoutElements.caption,
        title: unrenderablePostWithoutElements.title,
        price: unrenderablePostWithoutElements.price,
        scheduledPublicationTimestamp:
          unrenderablePostWithoutElements.scheduledPublicationTimestamp,
      };
    },
  );

  return {
    success: {
      renderablePosts,
    },
  };
}
