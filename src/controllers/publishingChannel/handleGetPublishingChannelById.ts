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
import { assembleRenderablePublishingChannelByPublishingChannelId } from "./utilities/assembleRenderablePublishingChannel";

export interface GetPublishingChannelByIdRequestBody {
  publishingChannelId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPublishingChannelByIdSuccess {
  publishingChannel: RenderablePublishingChannel;
}

export enum GetPublishingChannelByIdFailedReason {
  UnknownCause = "Unknown Cause",
  PublishingChannelIdNotFound = "PublishingChannelIdNotFound",
  ChannelOwnerNotFound = "ChannelOwnerNotFound",
}

export async function handleGetPublishingChannelById({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: GetPublishingChannelByIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPublishingChannelByIdFailedReason>,
    GetPublishingChannelByIdSuccess
  >
> {
  const { publishingChannelId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const assembleRenderablePublishingChannelByPublishingChannelIdResponse =
    await assembleRenderablePublishingChannelByPublishingChannelId({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      publishingChannelId,
      requestorUserId: clientUserId,
    });

  if (
    assembleRenderablePublishingChannelByPublishingChannelIdResponse.type ===
    EitherType.failure
  ) {
    return assembleRenderablePublishingChannelByPublishingChannelIdResponse;
  }

  const { success: renderablePublishingChannel } =
    assembleRenderablePublishingChannelByPublishingChannelIdResponse;

  return Success({
    publishingChannel: renderablePublishingChannel,
  });
}
