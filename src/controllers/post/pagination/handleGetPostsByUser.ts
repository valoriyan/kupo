import express from "express";
import { RenderablePost } from "../models";
import { PostController } from "../postController";
import { HTTPResponse } from "../../../types/httpResponse";
import { getClientUserId } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { decodeCursor, getNextPageOfPostsEncodedCursor } from "./utilities";
import { constructRenderablePostsFromParts } from "../utilities";

export interface GetPostsByUserIdParams {
  userId: string;
  cursor?: string;
  pageSize: number;
}

export interface GetPostsByUsernameParams {
  username: string;
  cursor?: string;
  pageSize: number;
}

export interface SuccessfulGetPostsByUserResponse {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPostsByUserResponseReason {
  UnknownCause = "Unknown Cause",
  UserPrivate = "This User's Posts Are Private",
  UnknownUser = "User Not Found",
}

export interface FailedtoGetPostsByUserResponse {
  reason: FailedtoGetPostsByUserResponseReason;
}

export async function handleGetPostsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsByUsernameParams;
}): Promise<
  HTTPResponse<FailedtoGetPostsByUserResponse, SuccessfulGetPostsByUserResponse>
> {
  const { username, ...restRequestBody } = requestBody;
  const userId =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserIdByUsername(
      username,
    );

  if (!userId) {
    return {
      error: { reason: FailedtoGetPostsByUserResponseReason.UnknownUser },
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
  requestBody: GetPostsByUserIdParams;
}): Promise<
  HTTPResponse<FailedtoGetPostsByUserResponse, SuccessfulGetPostsByUserResponse>
> {
  const { userId, pageSize, cursor } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canViewContent = await canUserViewUserContentByUserId({
    clientUserId,
    targetUserId: userId,
    databaseService: controller.databaseService,
  });

  if (!canViewContent) {
    return {
      error: { reason: FailedtoGetPostsByUserResponseReason.UserPrivate },
    };
  }

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsByCreatorUserId(
      {
        creatorUserId: userId,
        filterOutExpiredAndUnscheduledPosts: true,
        limit: pageSize,
        getPostsBeforeTimestamp: pageTimestamp,
      },
    );

  const posts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: unrenderablePostsWithoutElementsOrHashtags,
    clientUserId,
  });

  return {
    success: {
      posts,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getNextPageOfPostsEncodedCursor({
        posts: unrenderablePostsWithoutElementsOrHashtags,
      }),
    },
  };
}
