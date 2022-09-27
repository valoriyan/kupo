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
  backgroundImage?: Express.Multer.File;
  profilePicture?: Express.Multer.File;
  publishingChannelName: string;
  publishingChannelDescription: string;
  externalUrls: string[];
  publishingChannelRules: string[];
}

export interface CreatePublishingChannelSuccess {
  publishingChannelId: string;
  ownerUserId: string;
  name: string;
  description: string;
}

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
  const publishingChannelId = uuidv4();

  const {
    publishingChannelName,
    publishingChannelDescription,
    backgroundImage,
    profilePicture,
    externalUrls,
    publishingChannelRules,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // SAVE BACKGROUND IMAGE BLOB
  //////////////////////////////////////////////////
  let backgroundImageBlobFileKey = undefined;
  if (!!backgroundImage) {
    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: backgroundImage.buffer,
    });
    if (saveImageResponse.type === EitherType.failure) {
      return saveImageResponse;
    }
    backgroundImageBlobFileKey = saveImageResponse.success.fileKey;
  }

  //////////////////////////////////////////////////
  // SAVE PROFILE PICTURE IMAGE BLOB
  //////////////////////////////////////////////////
  let profilePictureBlobFileKey = undefined;
  if (!!profilePicture) {
    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: profilePicture?.buffer,
    });
    if (saveImageResponse.type === EitherType.failure) {
      return saveImageResponse;
    }
    profilePictureBlobFileKey = saveImageResponse.success.fileKey;
  }

  //////////////////////////////////////////////////
  // WRITE TO DATABASE
  //////////////////////////////////////////////////
  const createPublishingChannelResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.createPublishingChannel(
      {
        controller,
        publishingChannelId,
        ownerUserId: clientUserId,
        name: publishingChannelName,
        description: publishingChannelDescription,
        backgroundImageBlobFileKey,
        profilePictureBlobFileKey,
        publishingChannelRules,
        externalUrls,
      },
    );

  if (createPublishingChannelResponse.type === EitherType.failure) {
    return createPublishingChannelResponse;
  }

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({
    publishingChannelId,
    ownerUserId: clientUserId,
    name: publishingChannelName,
    description: publishingChannelDescription,
  });
}
