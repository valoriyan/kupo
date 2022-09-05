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

export interface GetPublishingChannelSubmissionsRequestBody {
  cursor?: string;
  pageSize: number;
  publishingChannelId: string;
}

export interface GetPublishingChannelSubmissionsSuccess {
  publishedItems: RenderablePublishedItem[];
}

export enum GetPublishingChannelSubmissionsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetPublishingChannelSubmissions({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: GetPublishingChannelSubmissionsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishingChannelSubmissionsFailedReason>,
    GetPublishingChannelSubmissionsSuccess
  >
> {
  const { cursor, pageSize, publishingChannelId } = requestBody;

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
        arePending: true,
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { timestamp_of_submission } = dbPublishingChannelSubmissions.find(
          ({ published_item_id }) => published_item_id === publishedItem.id,
        )!;
        return encodeTimestampCursor({ timestamp: parseInt(timestamp_of_submission) });
      },
    }),
  });
}
