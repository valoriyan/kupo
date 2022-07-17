import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentsFromParts } from "./utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";

export interface ReadPageOfCommentsByPublishedItemIdRequestBody {
  postId: string;
  cursor?: string;
  pageSize: number;
}

export interface ReadPageOfCommentsByPublishedItemIdSuccess {
  postComments: RenderablePostComment[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum ReadPageOfCommentsByPublishedItemIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleReadPageOfCommentsByPublishedItemId({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemCommentController;
  request: express.Request;
  requestBody: ReadPageOfCommentsByPublishedItemIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | ReadPageOfCommentsByPublishedItemIdFailedReason>,
    ReadPageOfCommentsByPublishedItemIdSuccess
  >
> {
  const { postId, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getPostCommentsByPostIdResponse =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentsByPostId(
      {
        controller,
        postId,
        afterTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
        pageSize,
      },
    );
  if (getPostCommentsByPostIdResponse.type === EitherType.failure) {
    return getPostCommentsByPostIdResponse;
  }
  const { success: unrenderablePostComments } = getPostCommentsByPostIdResponse;

  const constructRenderablePostCommentsFromPartsResponse =
    await constructRenderablePostCommentsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePostComments,
      clientUserId,
    });
  if (constructRenderablePostCommentsFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostCommentsFromPartsResponse;
  }
  const { success: renderablePostComments } =
    constructRenderablePostCommentsFromPartsResponse;

  const nextPageCursor =
    renderablePostComments.length === pageSize
      ? encodeTimestampCursor({
          timestamp:
            unrenderablePostComments[unrenderablePostComments.length - 1]
              .creationTimestamp,
        })
      : undefined;

  return Success({
    postComments: renderablePostComments,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
