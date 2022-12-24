import express from "express";
import { ClientKeyToFiledMediaElement } from "../../../controllers/models";
import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishingChannelController } from "../publishingChannelController";
import {
  validatePublishingChannelName,
  ValidatePublishingChannelNameFailedReason,
} from "./validations";

export interface CreatePublishingChannelRequestBody {
  backgroundImage?: ClientKeyToFiledMediaElement;
  profilePicture?: ClientKeyToFiledMediaElement;
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
        backgroundImageBlobFileKey: backgroundImage?.blobFileKey,
        profilePictureBlobFileKey: profilePicture?.blobFileKey,
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

  if (moderatorUserIds.length > 0) {
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
