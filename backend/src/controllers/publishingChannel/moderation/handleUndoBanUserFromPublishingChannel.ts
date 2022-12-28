import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";
import { doesUserIdHaveRightsToModeratePublishingChannel } from "../utilities/permissions";

export interface UndoBanUserFromPublishingChannelRequestBody {
  publishingChannelId: string;
  bannedUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UndoBanUserFromPublishingChannelSuccess {}

export enum UndoBanUserFromPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export async function handleUndoBanUserFromPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: UndoBanUserFromPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UndoBanUserFromPublishingChannelFailedReason>,
    UndoBanUserFromPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishingChannelId, bannedUserId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

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

  const { success: moderatingRights } =
    doesUserIdHaveRightsToModeratePublishingChannelResponse;

  if (!moderatingRights) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: UndoBanUserFromPublishingChannelFailedReason.IllegalAccess,
      error: "Illegal access at handleUndoBanUserFromPublishingChannel",
      additionalErrorInformation:
        "Illegal access at handleUndoBanUserFromPublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const removeBanFromUserIdForPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelUserBansTableService.removeBanFromUserIdForPublishingChannelId(
      {
        controller,
        publishingChannelId,
        userId: bannedUserId,
      },
    );

  if (removeBanFromUserIdForPublishingChannelIdResponse.type === EitherType.failure) {
    return removeBanFromUserIdForPublishingChannelIdResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
