import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { PublishingChannelController } from "./publishingChannelController";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubmitPublishedItemToPublishingChannelRequestBody {
  publishingChannelId: string;
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubmitPublishedItemToPublishingChannelSuccess {}

export enum SubmitPublishedItemToPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleSubmitPublishedItemToPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: SubmitPublishedItemToPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SubmitPublishedItemToPublishingChannelFailedReason>,
    SubmitPublishedItemToPublishingChannelSuccess
  >
> {
  const { publishingChannelId, publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishingChannelSubmissionId = uuidv4();

  const timestampOfSubmission = Date.now();

  const submitPublishedItemToPublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.submitPublishedItemToPublishingChannel(
      {
        controller,
        publishingChannelSubmissionId,
        publishingChannelId,
        userIdSubmittingPublishedItem: clientUserId,
        publishedItemId,
        timestampOfSubmission,
        isPending: false,
      },
    );

  if (submitPublishedItemToPublishingChannelResponse.type === EitherType.failure) {
    return submitPublishedItemToPublishingChannelResponse;
  }

  clientUserId;
  controller;
  request;
  requestBody;

  return Success({});
}
