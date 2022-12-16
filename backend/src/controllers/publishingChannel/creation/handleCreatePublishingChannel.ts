import express from "express";
import { BackendKupoFile, UploadableKupoFile } from "../../../controllers/models";
import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";
import { ingestUploadedFile } from "../../../controllers/utilities/mediaFiles/ingestUploadedFile";
import {
  validatePublishingChannelName,
  ValidatePublishingChannelNameFailedReason,
} from "./validations";

export interface CreatePublishingChannelRequestBody {
  backgroundImage?: UploadableKupoFile;
  profilePicture?: UploadableKupoFile;
  publishingChannelName: string;
  publishingChannelDescription: string;
  externalUrls: string[];
  publishingChannelRules: string[];
  bannedWords: string[];
  moderatorUserIds: string[];
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
    ErrorReasonTypes<
      | string
      | CreatePublishingChannelFailedReason
      | ValidatePublishingChannelNameFailedReason
    >,
    CreatePublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const publishingChannelId = uuidv4();

  const now = Date.now();

  const {
    publishingChannelName,
    publishingChannelDescription,
    backgroundImage,
    profilePicture,
    externalUrls,
    publishingChannelRules,
    moderatorUserIds,
    bannedWords,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // VALIDATE PUBLISHING CHANNEL NAME
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
  // SAVE BACKGROUND IMAGE BLOB
  //////////////////////////////////////////////////
  let backgroundImageBlobFileKey = undefined;
  if (!!backgroundImage) {
    const ingestedBackgroundImage: BackendKupoFile = ingestUploadedFile({
      uploadableKupoFile: backgroundImage,
    });

    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: ingestedBackgroundImage.buffer,
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
    const ingestedProfilePicture: BackendKupoFile = ingestUploadedFile({
      uploadableKupoFile: profilePicture,
    });

    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: ingestedProfilePicture.buffer,
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
        commaSeparatedBannedWords: bannedWords.join(","),
      },
    );

  if (createPublishingChannelResponse.type === EitherType.failure) {
    return createPublishingChannelResponse;
  }

  //////////////////////////////////////////////////
  // Add moderators
  //////////////////////////////////////////////////
  const registerPublishingChannelModeratorsResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.registerPublishingChannelModerators(
      {
        controller,
        publishingChannelModeratorRegistrations: moderatorUserIds.map(
          (moderatorUserId) => ({
            publishingChannelId,
            userId: moderatorUserId,
            creationTimestamp: now,
          }),
        ),
      },
    );

  if (registerPublishingChannelModeratorsResponse.type === EitherType.failure) {
    return registerPublishingChannelModeratorsResponse;
  }

  //////////////////////////////////////////////////
  // FOLLOW OWNER TO CHANNEL
  //////////////////////////////////////////////////
  const publishingChannelFollowEventId = uuidv4();

  const createPublishingChannelFollowResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.createPublishingChannelFollow(
      {
        controller,
        publishingChannelFollowEventId,
        userIdDoingFollowing: clientUserId,
        publishingChannelIdBeingFollowed: publishingChannelId,
        timestamp: Date.now(),
        isPending: false,
      },
    );

  if (createPublishingChannelFollowResponse.type === EitherType.failure) {
    return createPublishingChannelFollowResponse;
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
