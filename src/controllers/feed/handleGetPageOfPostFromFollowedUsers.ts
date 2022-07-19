import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../publishedItem/post/models";
import { constructRenderablePostsFromParts } from "../publishedItem/post/utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedUsersRequestBody {
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfPostFromFollowedUsersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfPostFromFollowedUsersSuccess {
  posts: RenderablePost[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfPostFromFollowedUsers({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPageOfPostFromFollowedUsersRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPageOfPostFromFollowedUsersFailedReason>,
    GetPageOfPostFromFollowedUsersSuccess
  >
> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getUserIdsFollowedByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { controller, userIdDoingFollowing: clientUserId },
    );
  if (getUserIdsFollowedByUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowedByUserIdResponse;
  }
  const { success: userIdsBeingFollowed } = getUserIdsFollowedByUserIdResponse;

  const getPublishedItemsByCreatorUserIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByCreatorUserIds(
      {
        controller,
        creatorUserIds: [...userIdsBeingFollowed, clientUserId],
        beforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
        pageSize,
      },
    );
  if (getPublishedItemsByCreatorUserIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByCreatorUserIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } =
    getPublishedItemsByCreatorUserIdsResponse;

  const constructRenderablePostsFromPartsResponse =
    await constructRenderablePostsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      clientUserId,
    });
  if (constructRenderablePostsFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostsFromPartsResponse;
  }
  const { success: renderablePosts } = constructRenderablePostsFromPartsResponse;

  const nextPageCursor =
    renderablePosts.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePosts[renderablePosts.length - 1].scheduledPublicationTimestamp,
        })
      : undefined;

  return Success({
    posts: renderablePosts,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
