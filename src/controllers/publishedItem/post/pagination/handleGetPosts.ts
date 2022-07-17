import express from "express";
import { RenderablePost } from "../models";
import { PostController } from "../postController";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  Success,
} from "../../../../utilities/monads";
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

export async function handleGetPostsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsByUsernameRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPostsByUsernameFailedReason>,
    GetPostsByUsernameSuccess
  >
> {
  const { username, ...restRequestBody } = requestBody;
  const selectUserIdByUsernameResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserIdByUsername(
      { controller, username },
    );
  if (selectUserIdByUsernameResponse.type === EitherType.failure) {
    return selectUserIdByUsernameResponse;
  }
  const { success: userId } = selectUserIdByUsernameResponse;

  if (!userId) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetPostsByUsernameFailedReason.UnknownUser,
      error: "User not found at handleGetPostsByUsername",
      additionalErrorInformation: "User not found at handleGetPostsByUsername",
    });
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
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPostsByUsernameFailedReason>,
    GetPostsByUsernameSuccess
  >
> {
  const { userId, pageSize, cursor } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canUserViewUserContentByUserIdResponse = await canUserViewUserContentByUserId({
    controller,
    clientUserId,
    targetUserId: userId,
    databaseService: controller.databaseService,
  });
  if (canUserViewUserContentByUserIdResponse.type === EitherType.failure) {
    return canUserViewUserContentByUserIdResponse;
  }
  const { success: canViewContent } = canUserViewUserContentByUserIdResponse;

  if (!canViewContent) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetPostsByUsernameFailedReason.UserPrivate,
      error: "Illegal access at handleGetPostsByUserId",
      additionalErrorInformation: "Illegal access at handleGetPostsByUserId",
    });
  }

  const getPublishedItemsByAuthorUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByAuthorUserId(
      {
        controller,
        authorUserId: userId,
        filterOutExpiredAndUnscheduledPublishedItems: true,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
      },
    );
  if (getPublishedItemsByAuthorUserIdResponse.type === EitherType.failure) {
    return getPublishedItemsByAuthorUserIdResponse;
  }
  const { success: unrenderablePostsWithoutElementsOrHashtags } =
    getPublishedItemsByAuthorUserIdResponse;

  const constructRenderablePostsFromPartsResponse =
    await constructRenderablePostsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: unrenderablePostsWithoutElementsOrHashtags,
      clientUserId,
    });
  if (constructRenderablePostsFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostsFromPartsResponse;
  }
  const { success: posts } = constructRenderablePostsFromPartsResponse;

  return Success({
    posts,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: unrenderablePostsWithoutElementsOrHashtags,
    }),
  });
}
