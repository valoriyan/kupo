import express from "express";
import { checkAuthentication } from "../../auth/utilities";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PublishingChannelController } from "../publishingChannelController";
import {
  validatePublishingChannelName,
  ValidatePublishingChannelNameFailedReason,
} from "./validations";

export interface IsPublishingChannelNameValidRequestBody {
  publishingChannelName: string;
}

export enum IsPublishingChannelNameValidFailedReason {
  Unknown = "Unknown",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IsPublishingChannelNameValidSuccess {}

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
    ErrorReasonTypes<
      | string
      | IsPublishingChannelNameValidFailedReason
      | ValidatePublishingChannelNameFailedReason
    >,
    IsPublishingChannelNameValidSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { errorResponse: error } = await checkAuthentication(controller, request);
  if (error) return error;

  const { publishingChannelName } = requestBody;

  //////////////////////////////////////////////////
  // Validate Publishing Channel Name
  //////////////////////////////////////////////////

  const validatePublishingChannelNameResponse = await validatePublishingChannelName({
    controller,
    databaseService: controller.databaseService,
    publishingChannelName,
  });

  if (validatePublishingChannelNameResponse.type === EitherType.failure) {
    return validatePublishingChannelNameResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
