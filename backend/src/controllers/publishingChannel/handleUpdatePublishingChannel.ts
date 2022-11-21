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
  updatedExternalUrls?: string[];
  updatedPublishingChannelRules?: string[];
  moderatorUserIds: string[];
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const now = Date.now();

  const {
    publishingChannelId,
    publishingChannelName,
    publishingChannelDescription,
    updatedExternalUrls,
    updatedPublishingChannelRules,
    moderatorUserIds,
  } = requestBody;

  //////////////////////////////////////////////////
  // Get Publishing Channel
  //////////////////////////////////////////////////

  const maybeGetPublishingChannelByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelById(
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

  if (publishingChannel.ownerUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UpdatePublishingChannelFailedReason.IllegalAccess,
      error: "Illegal Access at handleUpdatePost",
      additionalErrorInformation: "Illegal Access at handleUpdatePublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // Update Publishing Channel
  //////////////////////////////////////////////////

  const updatePublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.updatePublishingChannel(
      {
        controller,
        publishingChannelId,
        name: publishingChannelName,
        description: publishingChannelDescription,
        updatedExternalUrls,
        updatedPublishingChannelRules,
      },
    );

  if (updatePublishingChannelResponse.type === EitherType.failure) {
    return updatePublishingChannelResponse;
  }

  //////////////////////////////////////////////////
  // Delete previous moderators and upload new moderators
  //////////////////////////////////////////////////
  const removeAllPublishingChannelModeratorsFromPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.removeAllPublishingChannelModeratorsFromPublishingChannelId(
      {
        controller,
        publishingChannelId,
      },
    );

  if (
    removeAllPublishingChannelModeratorsFromPublishingChannelIdResponse.type ===
    EitherType.failure
  ) {
    return removeAllPublishingChannelModeratorsFromPublishingChannelIdResponse;
  }

  const registerPublishingChannelModeratorsResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.registerPublishingChannelModerators(
      {
        controller,
        publishingChannelModeratorRegistrations: moderatorUserIds.map(
          (moderatorUserId) => ({
            publishingChannelId,
            userId: moderatorUserId,
            creationTimestamp: now,
          }),
        ),
      },
    );

  if (registerPublishingChannelModeratorsResponse.type === EitherType.failure) {
    return registerPublishingChannelModeratorsResponse;
  }

  return Success({});
}
