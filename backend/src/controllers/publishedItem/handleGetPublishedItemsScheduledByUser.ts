import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "./models";
import { assemblePublishedItemsFromCachedComponents } from "./utilities/assemblePublishedItems";
import { PostController } from "./post/postController";

export interface GetPublishedItemsScheduledByUserRequestBody {
  // JS Timestamp
  rangeStartTimestamp: number;
  // JS Timestamp
  rangeEndTimestamp: number;
  publishedItemType?: PublishedItemType;
}

export interface GetPublishedItemsScheduledByUserSuccess {
  publishedItems: RenderablePublishedItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum GetPublishedItemsScheduledByUserFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetPublishedItemsScheduledByUser({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPublishedItemsScheduledByUserRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsScheduledByUserFailedReason>,
    GetPublishedItemsScheduledByUserSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { rangeStartTimestamp, rangeEndTimestamp, publishedItemType } = requestBody;

  //////////////////////////////////////////////////
  // Get Published Items
  //////////////////////////////////////////////////

  const getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId(
      {
        controller,
        creatorUserId: clientUserId,
        rangeEndTimestamp,
        rangeStartTimestamp,
        type: publishedItemType,
      },
    );
  if (
    getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse.type ===
    EitherType.failure
  ) {
    return getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse;
  }
  const { success: uncompiledBasePublishedItem } =
    getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Published Items
  //////////////////////////////////////////////////

  const constructPublishedItemsFromPartsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: uncompiledBasePublishedItem,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePosts } = constructPublishedItemsFromPartsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishedItems: renderablePosts,
  });
}
