import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../publishedItem/models";
import { assemblePublishedItemsFromCachedComponents } from "../publishedItem/utilities/assemblePublishedItems";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";
import { PublishedItemHostSelector } from "../../services/databaseService/tableServices/publishedItem/publishedItemsTableService";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { cursor, pageSize, publishedItemType } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Users Ids Followed by Client
  //////////////////////////////////////////////////
  const getUserIdsFollowedByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { controller, userIdDoingFollowing: clientUserId, areFollowsPending: false },
    );
  if (getUserIdsFollowedByUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowedByUserIdResponse;
  }
  const { success: userIdsBeingFollowed } = getUserIdsFollowedByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Published Items by Followed User Ids
  //////////////////////////////////////////////////

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
        publishedItemHost: PublishedItemHostSelector.user,
        filterOutExpiredAndUnscheduledPublishedItems: true,
      },
    );
  if (getPublishedItemsByCreatorUserIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByCreatorUserIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } =
    getPublishedItemsByCreatorUserIdsResponse;

  //////////////////////////////////////////////////
  // Assemble Published Items
  //////////////////////////////////////////////////

  const constructPublishedItemsFromPartsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePublishedItems } = constructPublishedItemsFromPartsResponse;

  //////////////////////////////////////////////////
  // Generate Next-Page-Cursor
  //////////////////////////////////////////////////

  const nextPageCursor =
    renderablePublishedItems.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePublishedItems[renderablePublishedItems.length - 1]
              .scheduledPublicationTimestamp,
        })
      : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishedItems: renderablePublishedItems,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
