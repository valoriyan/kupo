import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { PublishingChannelController } from "./publishingChannelController";

export interface UpdatePublishingChannelRequestBody {
  publishingChannelId: string;
  publishingChannelName: string;
  publishingChannelDescription: string;
}

export enum UpdatePublishingChannelFailedReason {
  Unknown = "Unknown",
  PublishingChannelIdNotFound = "PublishingChannelIdNotFound",
  IllegalAccess = "IllegalAccess",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePublishingChannelSuccess {}

export async function handleUpdatePublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: UpdatePublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdatePublishingChannelFailedReason>,
    UpdatePublishingChannelSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { publishingChannelId, publishingChannelName, publishingChannelDescription } =
    requestBody;

  // GET PUBLISHING CHANNEL AND CHECK THAT USER OWNS THE CHANNEL

  const maybeGetPublishingChannelByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.maybeGetPublishingChannelByPublishingChannelId(
      {
        controller,
        publishingChannelId,
      },
    );

  if (
    maybeGetPublishingChannelByPublishingChannelIdResponse.type === EitherType.failure
  ) {
    return maybeGetPublishingChannelByPublishingChannelIdResponse;
  }

  const { success: maybePublishingChannel } =
    maybeGetPublishingChannelByPublishingChannelIdResponse;

  if (!maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: UpdatePublishingChannelFailedReason.PublishingChannelIdNotFound,
      error,
      additionalErrorInformation: "Error at handleUpdatePublishingChannel",
    });
  }

  const publishingChannel = maybePublishingChannel;

  if (publishingChannel.owner.userId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UpdatePublishingChannelFailedReason.IllegalAccess,
      error: "Illegal Access at handleUpdatePost",
      additionalErrorInformation: "Illegal Access at handleUpdatePublishingChannel",
    });
  }

  const updatePublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.updatePublishingChannel(
      {
        controller,
        publishingChannelId,
        name: publishingChannelName,
        description: publishingChannelDescription,
      },
    );

  if (updatePublishingChannelResponse.type === EitherType.failure) {
    return updatePublishingChannelResponse;
  }

  return Success({});
}
