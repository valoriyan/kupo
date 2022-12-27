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

export interface DeletePublishingChannelRequestBody {
  publishingChannelId: string;
}

export enum DeletePublishingChannelFailedReason {
  Unknown = "Unknown",
  PublishingChannelIdNotFound = "PublishingChannelIdNotFound",
  IllegalAccess = "IllegalAccess",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePublishingChannelSuccess {}

export async function handleDeletePublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: DeletePublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | DeletePublishingChannelFailedReason>,
    DeletePublishingChannelSuccess
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

  const { publishingChannelId } = requestBody;

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
      reason: DeletePublishingChannelFailedReason.PublishingChannelIdNotFound,
      error,
      additionalErrorInformation: "Error at handleDeletePublishingChannel",
    });
  }

  const publishingChannel = maybePublishingChannel;

  //////////////////////////////////////////////////
  // Check that Requestor Owns Publishing Channel
  //////////////////////////////////////////////////

  if (publishingChannel.ownerUserId !== clientUserId) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: DeletePublishingChannelFailedReason.IllegalAccess,
      error: "Illegal Access at handleUpdatePost",
      additionalErrorInformation: "Illegal Access at handleDeletePublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // Delete From DB
  //////////////////////////////////////////////////

  const deletePublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.deletePublishingChannel(
      {
        controller,
        publishingChannelId,
        userId: clientUserId,
      },
    );

  if (deletePublishingChannelResponse.type === EitherType.failure) {
    return deletePublishingChannelResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
