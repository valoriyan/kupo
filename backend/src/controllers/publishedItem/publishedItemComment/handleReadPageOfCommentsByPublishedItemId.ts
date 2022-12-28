import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePublishedItemComment } from "./models";
import { assembleRenderablePublishedItemCommentsFromCachedComponents } from "./utilities";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishedItemId, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read Page of Unrenderable Comments from DB
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Assemble Page of Renderable Comments
  //////////////////////////////////////////////////

  const assembleRenderablePublishedItemCommentsFromCachedComponentsResponse =
    await assembleRenderablePublishedItemCommentsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishedItemComments: unrenderablePostComments,
      clientUserId,
    });
  if (
    assembleRenderablePublishedItemCommentsFromCachedComponentsResponse.type ===
    EitherType.failure
  ) {
    return assembleRenderablePublishedItemCommentsFromCachedComponentsResponse;
  }
  const { success: renderablePostComments } =
    assembleRenderablePublishedItemCommentsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Update Next Page Cursor
  //////////////////////////////////////////////////

  const nextPageCursor =
    renderablePostComments.length === pageSize
      ? encodeTimestampCursor({
          timestamp:
            unrenderablePostComments[unrenderablePostComments.length - 1]
              .creationTimestamp,
        })
      : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    postComments: renderablePostComments,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
