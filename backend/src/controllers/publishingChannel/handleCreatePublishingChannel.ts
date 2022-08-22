import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { PublishingChannelController } from "./publishingChannelController";

export interface CreatePublishingChannelRequestBody {
  publishingChannelName: string;
  publishingChannelDescription: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreatePublishingChannelSuccess {}

export enum CreatePublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleCreatePublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: CreatePublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreatePublishingChannelFailedReason>,
    CreatePublishingChannelSuccess
  >
> {
  const { publishingChannelName, publishingChannelDescription } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishingChannelId = uuidv4();

  const createPublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.createPublishingChannel(
      {
        controller,
        publishingChannelId,
        ownerUserId: clientUserId,
        name: publishingChannelName,
        description: publishingChannelDescription,
      },
    );

  if (createPublishingChannelResponse.type === EitherType.failure) {
    return createPublishingChannelResponse;
  }

  return Success({});
}
