import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "../publishedItem/post/models";
import { getPageOfPostsFromAllPosts } from "../publishedItem/post/pagination/utilities";
import { constructRenderablePostsFromParts } from "../publishedItem/post/utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

export interface GetPageOfPostFromFollowedHashtagRequestBody {
  hashtag: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfPostFromFollowedHashtagFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfPostFromFollowedHashtagSuccess {
  posts: RenderablePost[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfPostFromFollowedHashtag({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPageOfPostFromFollowedHashtagRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPageOfPostFromFollowedHashtagFailedReason>,
    GetPageOfPostFromFollowedHashtagSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { cursor, hashtag, pageSize } = requestBody;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const getPublishedItemsWithHashtagResponse =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPublishedItemsWithHashtag(
      { controller, hashtag: hashtag },
    );
  if (getPublishedItemsWithHashtagResponse.type === EitherType.failure) {
    return getPublishedItemsWithHashtagResponse;
  }
  const { success: postIdsWithHashtag } = getPublishedItemsWithHashtagResponse;

  const getPublishedItemsByIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        controller,
        ids: postIdsWithHashtag,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: unrenderablePostsWithoutElementsOrHashtags } =
    getPublishedItemsByIdsResponse;

  const filteredUnrenderablePostsWithoutElements = getPageOfPostsFromAllPosts({
    unrenderablePostsWithoutElementsOrHashtags,
    encodedCursor: cursor,
    pageSize: pageSize,
  });

  const constructRenderablePostsFromPartsResponse =
    await constructRenderablePostsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: filteredUnrenderablePostsWithoutElements,
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
