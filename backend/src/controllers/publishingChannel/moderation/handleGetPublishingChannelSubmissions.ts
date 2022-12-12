import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePublishedItem } from "../../publishedItem/models";
import { constructPublishedItemFromPartsById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";
import { getNextPageCursorOfPage } from "../../publishedItem/utilities/pagination";
import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { PublishingChannelController } from "../publishingChannelController";
import { doesUserIdHaveRightsToModeratePublishingChannel } from "../utilities/permissions";

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
  IllegalAccess = "Illegal Access",
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { cursor, pageSize, publishingChannelId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Check Authorization
  //////////////////////////////////////////////////

  const doesUserIdHaveRightsToModeratePublishingChannelResponse =
    await doesUserIdHaveRightsToModeratePublishingChannel({
      controller,
      databaseService: controller.databaseService,
      requestingUserId: clientUserId,
      publishingChannelId,
    });
  if (
    doesUserIdHaveRightsToModeratePublishingChannelResponse.type === EitherType.failure
  ) {
    return doesUserIdHaveRightsToModeratePublishingChannelResponse;
  }
  const { success: userHasRightsToModeration } =
    doesUserIdHaveRightsToModeratePublishingChannelResponse;

  if (!userHasRightsToModeration) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetPublishingChannelSubmissionsFailedReason.IllegalAccess,
      error: "Illegal access at handleGetPublishingChannelSubmissions",
      additionalErrorInformation:
        "Illegal access at handleGetPublishingChannelSubmissions",
    });
  }

  //////////////////////////////////////////////////
  // Get Unrenderable Submissions
  //////////////////////////////////////////////////

  const getPublishingChannelSubmissionsByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionsByPublishingChannelId(
      {
        controller,
        publishingChannelId,
        limit: pageSize,
        getSubmissionsBeforeTimestamp: pageTimestamp,
        arePending: true,
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

  //////////////////////////////////////////////////
  // Get Renderable Submssions
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return page of submissions
  //////////////////////////////////////////////////

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
