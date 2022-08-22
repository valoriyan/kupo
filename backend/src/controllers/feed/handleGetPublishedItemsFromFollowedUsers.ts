import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../publishedItem/models";
import { constructPublishedItemsFromParts } from "../publishedItem/utilities/constructPublishedItemsFromParts";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

export interface GetPublishedItemsFromFollowedUsersRequestBody {
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export enum GetPublishedItemsFromFollowedUsersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPublishedItemsFromFollowedUsersSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPublishedItemsFromFollowedUsers({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPublishedItemsFromFollowedUsersRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsFromFollowedUsersFailedReason>,
    GetPublishedItemsFromFollowedUsersSuccess
  >
> {
  const { cursor, pageSize, publishedItemType } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getUserIdsFollowedByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { controller, userIdDoingFollowing: clientUserId, areFollowsPending: false },
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
        type: publishedItemType,
      },
    );
  if (getPublishedItemsByCreatorUserIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByCreatorUserIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } =
    getPublishedItemsByCreatorUserIdsResponse;

  const constructPublishedItemsFromPartsResponse = await constructPublishedItemsFromParts(
    {
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      requestorUserId: clientUserId,
    },
  );
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePublishedItems } = constructPublishedItemsFromPartsResponse;

  const nextPageCursor =
    renderablePublishedItems.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePublishedItems[renderablePublishedItems.length - 1]
              .scheduledPublicationTimestamp,
        })
      : undefined;

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
