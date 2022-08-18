import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUserFromPartsByUserId } from "../user/utilities";
import { RenderablePublishingChannel } from "./models";
import { PublishingChannelController } from "./publishingChannelController";

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

  const maybeGetPublishingChannelByPublishingChannelIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.maybeGetPublishingChannelByPublishingChannelId(
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
      reason: GetPublishingChannelByIdFailedReason.PublishingChannelIdNotFound,
      error,
      additionalErrorInformation: "Error at handleGetPublishingChannelById",
    });
  }
  const unrenderablePublishingChannel = maybePublishingChannel;

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId: clientUserId,
      userId: unrenderablePublishingChannel.ownerUserId,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: publishingChannelOwner } =
    constructRenderableUserFromPartsByUserIdResponse;

  const renderablePublishingChannel: RenderablePublishingChannel = {
    publishingChannelId: unrenderablePublishingChannel.publishingChannelId,
    ownerUserId: unrenderablePublishingChannel.ownerUserId,
    name: unrenderablePublishingChannel.name,
    description: unrenderablePublishingChannel.description,
    owner: publishingChannelOwner,
  };

  return Success({
    publishingChannel: renderablePublishingChannel,
  });
}
