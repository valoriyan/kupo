import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePublishingChannel } from "./models";
import { PublishingChannelController } from "./publishingChannelController";
import { assembleRenderablePublishingChannelByName } from "./utilities/assembleRenderablePublishingChannel";

export interface GetPublishingChannelByNameRequestBody {
  publishingChannelName: string;
}

export interface GetPublishingChannelByNameSuccess {
  publishingChannel: RenderablePublishingChannel;
}

export enum GetPublishingChannelByNameFailedReason {
  UnknownCause = "Unknown Cause",
  PublishingChannelNameNotFound = "PublishingChannelNameNotFound",
  ChannelOwnerNotFound = "ChannelOwnerNotFound",
}

export async function handleGetPublishingChannelByName({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: GetPublishingChannelByNameRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishingChannelByNameFailedReason>,
    GetPublishingChannelByNameSuccess
  >
> {
  const { publishingChannelName } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const assembleRenderablePublishingChannelByNameResponse =
    await assembleRenderablePublishingChannelByName({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      name: publishingChannelName,
      requestorUserId: clientUserId,
    });

  if (assembleRenderablePublishingChannelByNameResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelByNameResponse;
  }

  const { success: renderablePublishingChannel } =
    assembleRenderablePublishingChannelByNameResponse;

  return Success({
    publishingChannel: renderablePublishingChannel,
  });
}
