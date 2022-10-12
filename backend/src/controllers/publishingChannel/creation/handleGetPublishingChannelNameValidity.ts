import express from "express";
import { checkAuthorization } from "../../auth/utilities";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PublishingChannelController } from "../publishingChannelController";

export interface IsPublishingChannelNameValidRequestBody {
  publishingChannelName: string;
}

export enum IsPublishingChannelNameValidFailedReason {
  Unknown = "Unknown",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IsPublishingChannelNameValidSuccess {
  isPublishingChannelNameAvailable: boolean;
}

export async function handleGetPublishingChannelNameValidity({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: IsPublishingChannelNameValidRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | IsPublishingChannelNameValidFailedReason>,
    IsPublishingChannelNameValidSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { publishingChannelName } = requestBody;

  //////////////////////////////////////////////////
  // Check if Publishing Channel Name Exists
  //////////////////////////////////////////////////

  const maybeGetPublishingChannelByNameResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelByName(
      {
        controller,
        name: publishingChannelName,
      },
    );

  if (maybeGetPublishingChannelByNameResponse.type === EitherType.failure) {
    return maybeGetPublishingChannelByNameResponse;
  }

  const { success: maybePublishingChannel } = maybeGetPublishingChannelByNameResponse;

  const isPublishingChannelNameAvailable = !maybePublishingChannel;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    isPublishingChannelNameAvailable,
  });
}
