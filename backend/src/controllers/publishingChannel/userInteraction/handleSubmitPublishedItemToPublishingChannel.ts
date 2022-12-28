import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";
import { v4 as uuidv4 } from "uuid";
import { doesUserIdHaveRightsToModeratePublishingChannel } from "../utilities/permissions";

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
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { publishingChannelId, publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const publishingChannelSubmissionId = uuidv4();

  const timestampOfSubmission = Date.now();

  //////////////////////////////////////////////////
  // See if user already has moderation privileges
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

  const { success: userHasModerationPrivileges } =
    doesUserIdHaveRightsToModeratePublishingChannelResponse;

  //////////////////////////////////////////////////
  // Write submission to DB
  //////////////////////////////////////////////////

  const submitPublishedItemToPublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.submitPublishedItemToPublishingChannel(
      {
        controller,
        publishingChannelSubmissionId,
        publishingChannelId,
        userIdSubmittingPublishedItem: clientUserId,
        publishedItemId,
        timestampOfSubmission,
        isPending: !userHasModerationPrivileges,
      },
    );

  if (submitPublishedItemToPublishingChannelResponse.type === EitherType.failure) {
    return submitPublishedItemToPublishingChannelResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
