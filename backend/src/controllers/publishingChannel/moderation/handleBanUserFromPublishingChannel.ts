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

export interface BanUserFromPublishingChannelRequestBody {
  publishingChannelId: string;
  bannedUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BanUserFromPublishingChannelSuccess {}

export enum BanUserFromPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export async function handleBanUserFromPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: BanUserFromPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | BanUserFromPublishingChannelFailedReason>,
    BanUserFromPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishingChannelId, bannedUserId } = requestBody;

  const now = Date.now();

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
      reason: BanUserFromPublishingChannelFailedReason.IllegalAccess,
      error: "Illegal access at handleBanUserFromPublishingChannel",
      additionalErrorInformation: "Illegal access at handleBanUserFromPublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const executeBanOfUserIdForPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelUserBansTableService.executeBanOfUserIdForPublishingChannelId(
      {
        controller,
        publishingChannelId,
        bannedUserId,
        executorUserId: clientUserId,
        executionTimestamp: now,
      },
    );

  if (executeBanOfUserIdForPublishingChannelIdResponse.type === EitherType.failure) {
    return executeBanOfUserIdForPublishingChannelIdResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
