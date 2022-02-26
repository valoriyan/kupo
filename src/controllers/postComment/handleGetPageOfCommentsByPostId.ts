import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { PostCommentController } from "./postCommentController";
import { RenderablePostComment, UnrenderablePostComment } from "./models";
import { constructRenderablePostCommentsFromParts } from "./utilities";
import { decodeCursor, encodeCursor } from "../post/pagination/utilities";

export interface GetPageOfCommentsByPostIdRequestBody {
  postId: string;
  cursor?: string;
  pageSize: number;
}

export interface SuccessfullyGotPageOfCommentsByPostIdResponse {
  postComments: RenderablePostComment[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedToGetPageOfCommentsByPostIdResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedToGetPageOfCommentsByPostIdResponse {
  reason: FailedToGetPageOfCommentsByPostIdResponseReason;
}

export async function handleGetPageOfCommentsByPostId({
  controller,
  request,
  requestBody,
}: {
  controller: PostCommentController;
  request: express.Request;
  requestBody: GetPageOfCommentsByPostIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPageOfCommentsByPostIdResponse,
    SuccessfullyGotPageOfCommentsByPostIdResponse
  >
> {
  const { postId, cursor, pageSize } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderablePostComments: UnrenderablePostComment[] =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentsByPostId(
      {
        postId,
        beforeTimestamp: cursor ? decodeCursor({ encodedCursor: cursor }) : undefined,
        pageSize,
      },
    );

  const renderablePostComments = await constructRenderablePostCommentsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    unrenderablePostComments,
    clientUserId,
  });

  const nextPageCursor =
    renderablePostComments.length === pageSize
      ? encodeCursor({
          timestamp:
            unrenderablePostComments[unrenderablePostComments.length - 1]
              .creationTimestamp,
        })
      : undefined;

  return {
    success: {
      postComments: renderablePostComments,
      previousPageCursor: cursor,
      nextPageCursor,
    },
  };
}
