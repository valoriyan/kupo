import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePublishedItem } from "../publishedItem/models";
import { constructPublishedItemFromPartsById } from "../publishedItem/utilities/constructPublishedItemsFromParts";
import { getNextPageCursorOfPage } from "../publishedItem/utilities/pagination";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { PublishingChannelController } from "./publishingChannelController";

export interface GetPublishingChannelSubmissionsRequestBody {
  cursor?: string;
  pageSize: number;
  publishingChannelId: string;
}

export interface GetPublishingChannelSubmissionsSuccess {
  publishedSubmissions: Array<{
    submissionId: string;
    publishedItem: RenderablePublishedItem;
  }>;
  previousPageCursor?: string;
  nextPageCursor?: string;
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

  const publishedSubmissionPromises = dbPublishingChannelSubmissions.map(
    async (submission) => ({
      submissionId: submission.publishing_channel_submission_id,
      publishedItem: await constructPublishedItemFromPartsById({
        controller,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        publishedItemId: submission.published_item_id,
        requestorUserId: clientUserId,
      }),
    }),
  );

  const resolvedPublishedSubmissions = await Promise.all(publishedSubmissionPromises);

  const publishedSubmissions: GetPublishingChannelSubmissionsSuccess["publishedSubmissions"] =
    [];
  for (const resolvedSubmission of resolvedPublishedSubmissions) {
    if (resolvedSubmission.publishedItem.type === EitherType.failure) {
      return resolvedSubmission.publishedItem;
    }
    publishedSubmissions.push({
      submissionId: resolvedSubmission.submissionId,
      publishedItem: resolvedSubmission.publishedItem.success,
    });
  }

  return Success({
    publishedSubmissions,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getNextPageCursorOfPage({
      items: publishedSubmissions,
      getTimestampFromItem: (publishedSubmission) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { timestamp_of_submission } = dbPublishingChannelSubmissions.find(
          ({ published_item_id }) =>
            published_item_id === publishedSubmission.publishedItem.id,
        )!;
        return encodeTimestampCursor({ timestamp: parseInt(timestamp_of_submission) });
      },
    }),
  });
}
