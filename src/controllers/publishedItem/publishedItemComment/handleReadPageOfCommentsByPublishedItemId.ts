import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePostComment, UnrenderablePostComment } from "./models";
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
    ReadPageOfCommentsByPublishedItemIdFailedReason,
    ReadPageOfCommentsByPublishedItemIdSuccess
  >
> {
  const { postId, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unrenderablePostComments: UnrenderablePostComment[] =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentsByPostId(
      {
        postId,
        afterTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
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
      ? encodeTimestampCursor({
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
