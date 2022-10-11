import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { RenderablePublishingChannel } from "./models";
import { PublishingChannelController } from "./publishingChannelController";
import { assembleRenderablePublishingChannelFromParts } from "./utilities/assembleRenderablePublishingChannel/assembleRenderablePublishingChannelFromParts";
import { isUserOwnerOfPublishingChannel } from "./utilities/permissions";

export enum UpdatePublishingChannelBackgroundImageFailedReason {
  Unknown = "Unknown",
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
}

export interface UpdatePublishingChannelBackgroundImageSuccess {
  publishingChannel: RenderablePublishingChannel;
}

export interface UpdatePublishingChannelBackgroundImageRequestBody {
  backgroundImage: Express.Multer.File;
  publishingChannelId: string;
}

export async function handleUpdatePublishingChannelBackgroundImage({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: UpdatePublishingChannelBackgroundImageRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdatePublishingChannelBackgroundImageFailedReason>,
    UpdatePublishingChannelBackgroundImageSuccess
  >
> {
  const { backgroundImage, publishingChannelId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // CONFIRM CLIENT IS OWNER
  //////////////////////////////////////////////////

  const isUserOwnerOfPublishingChannelResponse = await isUserOwnerOfPublishingChannel({
    controller,
    databaseService: controller.databaseService,
    requestingUserId: clientUserId,
    publishingChannelId,
  });
  if (isUserOwnerOfPublishingChannelResponse.type === EitherType.failure) {
    return isUserOwnerOfPublishingChannelResponse;
  }
  if (!isUserOwnerOfPublishingChannelResponse.success) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: UpdatePublishingChannelBackgroundImageFailedReason.ILLEGAL_ACCESS,
      error: "Illegal Access at handleUpdatePublishingChannelBackgroundImage",
      additionalErrorInformation:
        "Illegal Access at handleUpdatePublishingChannelBackgroundImage",
    });
  }

  //////////////////////////////////////////////////
  // SAVE IMAGE BLOB
  //////////////////////////////////////////////////
  let backgroundImageBlobItemPointer = undefined;
  if (!!backgroundImage) {
    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: backgroundImage.buffer,
    });
    if (saveImageResponse.type === EitherType.failure) {
      return saveImageResponse;
    }
    backgroundImageBlobItemPointer = saveImageResponse.success;
  }

  //////////////////////////////////////////////////
  // UPDATE PUBLISHING CHANNEL
  //////////////////////////////////////////////////
  const updatePublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.updatePublishingChannel(
      {
        controller,
        publishingChannelId,

        backgroundImageBlobFileKey: backgroundImageBlobItemPointer?.fileKey,
      },
    );
  if (updatePublishingChannelResponse.type === EitherType.failure) {
    return updatePublishingChannelResponse;
  }

  const { success: unrenderablePublishingChannel } = updatePublishingChannelResponse;

  if (!unrenderablePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Publishing Channel not found at handleUpdatePublishingChannelBackgroundImage",
      additionalErrorInformation: "Error at handleUpdatePublishingChannelBackgroundImage",
    });
  }

  //////////////////////////////////////////////////
  // ASSEMBLE RENDERABLE PUBLISHING CHANNEL
  //////////////////////////////////////////////////
  const assembleRenderablePublishingChannelFromPartsResponse =
    await assembleRenderablePublishingChannelFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishingChannel,
      requestorUserId: clientUserId,
    });

  if (assembleRenderablePublishingChannelFromPartsResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelFromPartsResponse;
  }

  const { success: renderablePublishingChannel } =
    assembleRenderablePublishingChannelFromPartsResponse;

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({ publishingChannel: renderablePublishingChannel });
}
