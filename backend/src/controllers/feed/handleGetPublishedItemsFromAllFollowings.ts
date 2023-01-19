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

export interface GetPublishedItemsFromAllFollowingsRequestBody {
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
}

export enum GetPublishedItemsFromAllFollowingsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPublishedItemsFromAllFollowingsSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPublishedItemsFromAllFollowings({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPublishedItemsFromAllFollowingsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsFromAllFollowingsFailedReason>,
    GetPublishedItemsFromAllFollowingsSuccess
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
  // Get Published Items by Followed User Ids
  //////////////////////////////////////////////////

  const getPublishedItemsFromAllFollowingsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsFromAllFollowings(
      {
        controller,
        requestingUserId: clientUserId,
        beforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
        pageSize,
        type: publishedItemType,
        filterOutExpiredAndUnscheduledPublishedItems: true,
      },
    );
  if (getPublishedItemsFromAllFollowingsResponse.type === EitherType.failure) {
    return getPublishedItemsFromAllFollowingsResponse;
  }
  const { success: uncompiledBasePublishedItems } =
    getPublishedItemsFromAllFollowingsResponse;

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
