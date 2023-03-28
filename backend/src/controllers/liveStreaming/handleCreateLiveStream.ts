/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import { ErrorReasonTypes, SecuredHTTPResponse, Success } from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { LiveStreamingController } from "./liveStreamingController";

export enum CreateLiveStreamFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface CreateLiveStreamSuccess {}

export interface CreateLiveStreamRequestBody {}

export async function handleCreateLiveStream({
  controller,
  request,
}: // requestBody,
{
  controller: LiveStreamingController;
  request: express.Request;
  // requestBody: CreateLiveStreamRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreateLiveStreamFailedReason>,
    CreateLiveStreamSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  if (clientUserId) {
    await controller.liveStreamingService.createLiveInput();
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
