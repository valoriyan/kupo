import express from "express";
import { GenericResponseFailedReason } from "../../models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";

export interface RemoveModeratorFromPublishingChannelRequestBody {
  publishingChannelId: string;
  moderatorUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveModeratorFromPublishingChannelSuccess {}

export enum RemoveModeratorFromPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export async function handleRemoveModeratorFromPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: RemoveModeratorFromPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | RemoveModeratorFromPublishingChannelFailedReason>,
    RemoveModeratorFromPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishingChannelId, moderatorUserId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read Unrenderable Publishing Channel From DB
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
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "Publishing Channel not found at handleRemoveModeratorFromPublishingChannel",
      additionalErrorInformation:
        "Publishing Channel not found at handleRemoveModeratorFromPublishingChannel",
    });
  }
  const publishingChannel = maybePublishingChannel;

  //////////////////////////////////////////////////
  // Check Authorization
  //////////////////////////////////////////////////

  if (publishingChannel.ownerUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: RemoveModeratorFromPublishingChannelFailedReason.IllegalAccess,
      error: "Illegal access at handleRemoveModeratorFromPublishingChannel",
      additionalErrorInformation:
        "Illegal access at handleRemoveModeratorFromPublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

  const removePublishingChannelModeratorResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.removePublishingChannelModerator(
      {
        controller,
        publishingChannelId,
        userId: moderatorUserId,
      },
    );

  if (removePublishingChannelModeratorResponse.type === EitherType.failure) {
    return removePublishingChannelModeratorResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
