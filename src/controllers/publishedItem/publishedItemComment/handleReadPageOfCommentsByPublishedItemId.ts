import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePublishedItemComment } from "./models";
import { constructRenderablePublishedItemCommentsFromParts } from "./utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";

export interface ReadPageOfCommentsByPublishedItemIdRequestBody {
  publishedItemId: string;
  cursor?: string;
  pageSize: number;
}

export interface ReadPageOfCommentsByPublishedItemIdSuccess {
  postComments: RenderablePublishedItemComment[];
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
  const { publishedItemId, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getPublishedItemCommentsByPublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getPublishedItemCommentsByPublishedItemId(
      {
        controller,
        publishedItemId,
        afterTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
        pageSize,
      },
    );
  if (getPublishedItemCommentsByPublishedItemIdResponse.type === EitherType.failure) {
    return getPublishedItemCommentsByPublishedItemIdResponse;
  }
  const { success: unrenderablePostComments } =
    getPublishedItemCommentsByPublishedItemIdResponse;

  const constructRenderablePostCommentsFromPartsResponse =
    await constructRenderablePublishedItemCommentsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishedItemComments: unrenderablePostComments,
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
