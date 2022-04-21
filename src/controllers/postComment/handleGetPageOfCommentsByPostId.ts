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

export interface GetPageOfCommentsByPostIdSuccess {
  postComments: RenderablePostComment[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfCommentsByPostIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfCommentsByPostIdFailure {
  reason: GetPageOfCommentsByPostIdFailedReason;
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
    GetPageOfCommentsByPostIdFailure,
    GetPageOfCommentsByPostIdSuccess
  >
> {
  const { postId, cursor, pageSize } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderablePostComments: UnrenderablePostComment[] =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentsByPostId(
      {
        postId,
        afterTimestamp: cursor ? decodeCursor({ encodedCursor: cursor }) : undefined,
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
