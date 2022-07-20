import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemType, RenderablePublishedItem } from "../models";
import { constructPublishedItemsFromParts } from "../utilities/constructPublishedItemsFromParts";
import { PostController } from "./postController";

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
export interface GetPublishedItemsScheduledByUserFailed {}

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
    ErrorReasonTypes<string | GetPublishedItemsScheduledByUserFailed>,
    GetPublishedItemsScheduledByUserSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { rangeStartTimestamp, rangeEndTimestamp, publishedItemType } = requestBody;

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

  const constructPublishedItemsFromPartsResponse = await constructPublishedItemsFromParts(
    {
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: uncompiledBasePublishedItem,
      clientUserId,
    },
  );
  if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemsFromPartsResponse;
  }
  const { success: renderablePosts } = constructPublishedItemsFromPartsResponse;

  return Success({
    publishedItems: renderablePosts,
  });
}
