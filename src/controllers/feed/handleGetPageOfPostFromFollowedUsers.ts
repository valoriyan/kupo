import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
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
    GetPageOfPostFromFollowedUsersFailedReason,
    GetPageOfPostFromFollowedUsersSuccess
  >
> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const userIdsBeingFollowed: string[] =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { userIdDoingFollowing: clientUserId },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByCreatorUserIds(
      {
        creatorUserIds: [...userIdsBeingFollowed, clientUserId],
        beforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
        pageSize,
      },
    );

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems: unrenderablePostsWithoutElementsOrHashtags,
    clientUserId,
  });

  const nextPageCursor =
    renderablePosts.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePosts[renderablePosts.length - 1].scheduledPublicationTimestamp,
        })
      : undefined;

  return {
    type: EitherType.success,
    success: {
      posts: renderablePosts,
      previousPageCursor: cursor,
      nextPageCursor,
    },
  };
}
