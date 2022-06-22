import express from "express";
import { RenderablePost } from "../models";
import { PostController } from "../postController";
import { HTTPResponse } from "../../../../types/httpResponse";
import { getClientUserId } from "../../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../../auth/utilities/canUserViewUserContent";
import { getEncodedCursorOfNextPageOfSequentialItems } from "./utilities";
import { constructRenderablePostsFromParts } from "../utilities";
import { decodeTimestampCursor } from "../../../utilities/pagination";

export interface GetPostsByUserIdRequestBody {
  userId: string;
  cursor?: string;
  pageSize: number;
}

export interface GetPostsByUsernameRequestBody {
  username: string;
  cursor?: string;
  pageSize: number;
}

export interface GetPostsByUsernameSuccess {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPostsByUsernameFailedReason {
  UnknownCause = "Unknown Cause",
  UserPrivate = "This User's Posts Are Private",
  UnknownUser = "User Not Found",
}

export interface GetPostsByUsernameFailed {
  reason: GetPostsByUsernameFailedReason;
}

export async function handleGetPostsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsByUsernameRequestBody;
}): Promise<HTTPResponse<GetPostsByUsernameFailed, GetPostsByUsernameSuccess>> {
  const { username, ...restRequestBody } = requestBody;
  const userId =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserIdByUsername(
      username,
    );

  if (!userId) {
    return {
      error: { reason: GetPostsByUsernameFailedReason.UnknownUser },
    };
  }

  return handleGetPostsByUserId({
    controller,
    request,
    requestBody: { ...restRequestBody, userId },
  });
}

export async function handleGetPostsByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsByUserIdRequestBody;
}): Promise<HTTPResponse<GetPostsByUsernameFailed, GetPostsByUsernameSuccess>> {
  const { userId, pageSize, cursor } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canViewContent = await canUserViewUserContentByUserId({
    clientUserId,
    targetUserId: userId,
    databaseService: controller.databaseService,
  });

  if (!canViewContent) {
    return {
      error: { reason: GetPostsByUsernameFailedReason.UserPrivate },
    };
  }

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByAuthorUserId(
      {
        authorUserId: userId,
        filterOutExpiredAndUnscheduledPublishedItems: true,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
      },
    );

  const posts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems: unrenderablePostsWithoutElementsOrHashtags,
    clientUserId,
  });

  return {
    success: {
      posts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
        sequentialFeedItems: unrenderablePostsWithoutElementsOrHashtags,
      }),
    },
  };
}
