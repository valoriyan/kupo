/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePublishedItem } from "../publishedItem/models";
import { constructPublishedItemsFromPartsById } from "../publishedItem/utilities/constructPublishedItemsFromParts";
import { getNextPageCursorOfPage } from "../publishedItem/utilities/pagination";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { PublishingChannelController } from "./publishingChannelController";

export interface GetPublishedItemsInPublishingChannelRequestBody {
  publishingChannelId: string;
  cursor?: string;
  pageSize: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPublishedItemsInPublishingChannelSuccess {
  publishedItems: RenderablePublishedItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPublishedItemsInPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  ChannelNotFound = "ChannelNotFound",
}

export async function handleGetPublishedItemsInPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: GetPublishedItemsInPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishedItemsInPublishingChannelFailedReason>,
    GetPublishedItemsInPublishingChannelSuccess
  >
> {
  const { publishingChannelId, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const getPublishingChannelSubmissionsByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionsByPublishingChannelId(
      {
        controller,
        publishingChannelId,
        limit: pageSize,
        getSubmissionsBeforeTimestamp: pageTimestamp,
        arePending: false,
      },
    );
  if (
    getPublishingChannelSubmissionsByPublishingChannelIdResponse.type ===
    EitherType.failure
  ) {
    return getPublishingChannelSubmissionsByPublishingChannelIdResponse;
  }
  const { success: dbPublishingChannelSubmissions } =
    getPublishingChannelSubmissionsByPublishingChannelIdResponse;

  const publishedItemIds = dbPublishingChannelSubmissions.map(
    ({ published_item_id }) => published_item_id,
  );

  const constructPublishedItemsFromPartsByIdRequest =
    await constructPublishedItemsFromPartsById({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      publishedItemIds,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemsFromPartsByIdRequest.type === EitherType.failure) {
    return constructPublishedItemsFromPartsByIdRequest;
  }
  const { success: publishedItems } = constructPublishedItemsFromPartsByIdRequest;

  return Success({
    publishedItems,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getNextPageCursorOfPage({
      items: publishedItems,
      getTimestampFromItem: (publishedItem: RenderablePublishedItem) => {
        const { timestamp_of_submission } = dbPublishingChannelSubmissions.find(
          ({ published_item_id }) => published_item_id === publishedItem.id,
        )!;
        return encodeTimestampCursor({ timestamp: parseInt(timestamp_of_submission) });
      },
    }),
  });
}
