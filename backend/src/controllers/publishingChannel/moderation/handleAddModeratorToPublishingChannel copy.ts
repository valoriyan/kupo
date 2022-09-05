import express from "express";
import { GenericResponseFailedReason } from "../../../controllers/models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";

export interface AddModeratorToPublishingChannelRequestBody {
  publishingChannelId: string;
  moderatorUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AddModeratorToPublishingChannelSuccess {}

export enum AddModeratorToPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export async function handleAddModeratorToPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: AddModeratorToPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | AddModeratorToPublishingChannelFailedReason>,
    AddModeratorToPublishingChannelSuccess
  >
> {
  const { publishingChannelId, moderatorUserId } = requestBody;

  const now = Date.now();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "Publishing Channel not found at handleAddModeratorToPublishingChannel",
      additionalErrorInformation:
        "Publishing Channel not found at handleAddModeratorToPublishingChannel",
    });
  }
  const publishingChannel = maybePublishingChannel;

  if (publishingChannel.ownerUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: AddModeratorToPublishingChannelFailedReason.IllegalAccess,
      error: "Illegal access at handleAddModeratorToPublishingChannel",
      additionalErrorInformation:
        "Illegal access at handleAddModeratorToPublishingChannel",
    });
  }

  const registerPublishingChannelModeratorResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.registerPublishingChannelModerator(
      {
        controller,
        publishingChannelId,
        userId: moderatorUserId,
        creationTimestamp: now,
      },
    );

  if (registerPublishingChannelModeratorResponse.type === EitherType.failure) {
    return registerPublishingChannelModeratorResponse;
  }

  return Success({});
}
