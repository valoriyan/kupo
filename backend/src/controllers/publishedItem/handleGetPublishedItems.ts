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
import { getEncodedCursorOfNextPageOfSequentialItems } from "./utilities/pagination";
import { decodeTimestampCursor } from "../utilities/pagination";
import { PublishedItemType, RenderablePublishedItem } from "./models";
import { assemblePublishedItemsFromCachedComponents } from "./utilities/assemblePublishedItems";
import { canUserViewUserContentByUserId } from "../auth/utilities/canUserViewUserContentByUserId";

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
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { username, ...restRequestBody } = requestBody;

  //////////////////////////////////////////////////
  // Read User Id of Target From DB
  //////////////////////////////////////////////////

  const getMaybeUserIdByUsername =
    await controller.databaseService.tableNameToServicesMap.usersTableService.getMaybeUserIdByUsername(
      { controller, username },
    );
  if (getMaybeUserIdByUsername.type === EitherType.failure) {
    return getMaybeUserIdByUsername;
  }
  const { success: maybeUserId } = getMaybeUserIdByUsername;

  if (!maybeUserId) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetPublishedItemsByUsernameFailedReason.UnknownUser,
      error: "User not found at handleGetPostsByUsername",
      additionalErrorInformation: "User not found at handleGetPostsByUsername",
    });
  }
  const userId = maybeUserId;

  //////////////////////////////////////////////////
  // Continue Request with User Id
  //////////////////////////////////////////////////

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
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { userId, pageSize, cursor, publishedItemType } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Check Authorization
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Read UnassembledBasePublishedItems from DB
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Assemble RenderablePublishedItems
  //////////////////////////////////////////////////

  const assemblePublishedItemsFromCachedComponentsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: unrenderablePostsWithoutElementsOrHashtags,
      requestorUserId: clientUserId,
    });
  if (assemblePublishedItemsFromCachedComponentsResponse.type === EitherType.failure) {
    return assemblePublishedItemsFromCachedComponentsResponse;
  }
  const { success: publishedItems } = assemblePublishedItemsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishedItems,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: publishedItems,
    }),
  });
}
