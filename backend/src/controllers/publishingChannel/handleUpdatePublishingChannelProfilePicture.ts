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
import { assembleRenderablePublishingChannelFromParts } from "./utilities/assembleRenderablePublishingChannel";
import { isUserOwnerOfPublishingChannel } from "./utilities/permissions";

export enum UpdatePublishingChannelProfilePictureFailedReason {
  Unknown = "Unknown",
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
}

export interface UpdatePublishingChannelProfilePictureSuccess {
  publishingChannel: RenderablePublishingChannel;
}

export interface UpdatePublishingChannelProfilePictureRequestBody {
  profilePicture: Express.Multer.File;
  publishingChannelId: string;
}

export async function handleUpdatePublishingChannelProfilePicture({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: UpdatePublishingChannelProfilePictureRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdatePublishingChannelProfilePictureFailedReason>,
    UpdatePublishingChannelProfilePictureSuccess
  >
> {
  const { profilePicture, publishingChannelId } = requestBody;

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
      reason: UpdatePublishingChannelProfilePictureFailedReason.ILLEGAL_ACCESS,
      error: "Illegal Access at handleUpdatePublishingChannelBackgroundImage",
      additionalErrorInformation:
        "Illegal Access at handleUpdatePublishingChannelBackgroundImage",
    });
  }

  //////////////////////////////////////////////////
  // SAVE IMAGE BLOB
  //////////////////////////////////////////////////
  let profilePictureBlobItemPointer = undefined;
  if (!!profilePicture) {
    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: requestBody.profilePicture?.buffer,
    });
    if (saveImageResponse.type === EitherType.failure) {
      return saveImageResponse;
    }
    profilePictureBlobItemPointer = saveImageResponse.success;
  }

  //////////////////////////////////////////////////
  // UPDATE PUBLISHING CHANNEL
  //////////////////////////////////////////////////

  const updatePublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.updatePublishingChannel(
      {
        controller,
        publishingChannelId,

        backgroundImageBlobFileKey: profilePictureBlobItemPointer?.fileKey,
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
        "Publishing Channel not found at handleUpdatePublishingChannelProfilePicture",
      additionalErrorInformation: "Error at handleUpdatePublishingChannelProfilePicture",
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
