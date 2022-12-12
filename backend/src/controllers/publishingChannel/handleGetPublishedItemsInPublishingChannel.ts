/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { PublishedItemType, RenderablePublishedItem } from "../publishedItem/models";
import { constructPublishedItemsFromPartsById } from "../publishedItem/utilities/constructPublishedItemsFromParts";
import { getNextPageCursorOfPage } from "../publishedItem/utilities/pagination";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { PublishingChannelController } from "./publishingChannelController";

export interface GetPublishedItemsInPublishingChannelRequestBody {
  publishingChannelName: string;
  cursor?: string;
  pageSize: number;
  publishedItemType?: PublishedItemType;
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { publishingChannelName, cursor, pageSize, publishedItemType } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Get publishing channel
  //////////////////////////////////////////////////

  const maybeGetPublishingChannelByNameResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelByName(
      {
        controller,
        name: publishingChannelName,
      },
    );
  if (maybeGetPublishingChannelByNameResponse.type === EitherType.failure) {
    return maybeGetPublishingChannelByNameResponse;
  }
  const { success: maybePublishingChannel } = maybeGetPublishingChannelByNameResponse;
  if (!maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "Publishing channel not found",
      additionalErrorInformation:
        "Error at PublishingChannelController.selectPublishingChannelByPublishingChannelId",
    });
  }
  const { publishingChannelId } = maybePublishingChannel;

  //////////////////////////////////////////////////
  // Get content items in channel
  //////////////////////////////////////////////////

  const getPublishingChannelSubmissionsByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionsByPublishingChannelId(
      {
        controller,
        publishingChannelId,
        limit: pageSize,
        getSubmissionsBeforeTimestamp: pageTimestamp,
        arePending: false,
        publishedItemType,
        hasBeenRejectedWithAReason: false,
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

  //////////////////////////////////////////////////
  // Construct renderable published items
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

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
