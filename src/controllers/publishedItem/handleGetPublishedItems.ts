import express from "express";
import { PostController } from "./post/postController";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  Success,
} from "../../utilities/monads";
import { getClientUserId } from "../auth/utilities";
import { canUserViewUserContentByUserId } from "../auth/utilities/canUserViewUserContent";
import { getEncodedCursorOfNextPageOfSequentialItems } from "./utilities/pagination";
import { decodeTimestampCursor } from "../utilities/pagination";
import { PublishedItemType, RenderablePublishedItem } from "./models";
import { constructPublishedItemsFromParts } from "./utilities/constructPublishedItemsFromParts";

export interface GetPublishedItemsByUserIdRequestBody {
  userId: string;
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export interface GetPublishedItemsByUsernameRequestBody {
  username: string;
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export interface GetPublishedItemsByUsernameSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPublishedItemsByUsernameFailedReason {
  UnknownCause = "Unknown Cause",
  UserPrivate = "This User's Posts Are Private",
  UnknownUser = "User Not Found",
}

export async function handleGetPublishedItemsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPublishedItemsByUsernameRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsByUsernameFailedReason>,
    GetPublishedItemsByUsernameSuccess
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
      reason: GetPublishedItemsByUsernameFailedReason.UnknownUser,
      error: "User not found at handleGetPostsByUsername",
      additionalErrorInformation: "User not found at handleGetPostsByUsername",
    });
  }

  return handleGetPublishedItemsByUserId({
    controller,
    request,
    requestBody: { ...restRequestBody, userId },
  });
}

export async function handleGetPublishedItemsByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPublishedItemsByUserIdRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsByUsernameFailedReason>,
    GetPublishedItemsByUsernameSuccess
  >
> {
  const { userId, pageSize, cursor, publishedItemType } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canUserViewUserContentByUserIdResponse = await canUserViewUserContentByUserId({
    controller,
    requestorUserId: clientUserId,
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
      reason: GetPublishedItemsByUsernameFailedReason.UserPrivate,
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
        type: publishedItemType,
      },
    );
  if (getPublishedItemsByAuthorUserIdResponse.type === EitherType.failure) {
    return getPublishedItemsByAuthorUserIdResponse;
  }
  const { success: unrenderablePostsWithoutElementsOrHashtags } =
    getPublishedItemsByAuthorUserIdResponse;

  const constructPublishedItemsFromPartsResponse = await constructPublishedItemsFromParts(
    {
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: unrenderablePostsWithoutElementsOrHashtags,
      requestorUserId: clientUserId,
    },
  );
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: publishedItems } = constructPublishedItemsFromPartsResponse;

  return Success({
    publishedItems,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: publishedItems,
    }),
  });
}
