import { Promise as BluebirdPromise } from "bluebird";
import { DatabaseService } from "../../../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { RenderablePublishingChannel, UnrenderablePublishingChannel } from "../../models";
import {
  assembleRenderableUserById,
  assembleRenderableUsersByIds,
} from "../../../user/utilities/assembleRenderableUserById";
import { BlobStorageService } from "../../../../services/blobStorageService";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";

export async function assembleRenderablePublishingChannelsFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishingChannels,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePublishingChannels: UnrenderablePublishingChannel[];
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel[]>
> {
  //////////////////////////////////////////////////
  // Assemble Publishing Channels
  //////////////////////////////////////////////////

  const assembleRenderablePublishingChannelFromPartsResponses = await BluebirdPromise.map(
    unrenderablePublishingChannels,
    async (unrenderablePublishingChannel) =>
      await assembleRenderablePublishingChannelFromParts({
        controller,
        requestorUserId: requestorUserId,
        unrenderablePublishingChannel,
        blobStorageService,
        databaseService,
      }),
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePublishingChannelFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePublishingChannelFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishingChannel,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePublishingChannel: UnrenderablePublishingChannel;
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel>
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const {
    publishingChannelId,
    ownerUserId,
    name,
    description,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
    publishingChannelRules,
    externalUrls,
    bannedWords,
  } = unrenderablePublishingChannel;

  //////////////////////////////////////////////////
  // Get Temporary Url for Background Image
  //////////////////////////////////////////////////
  let backgroundImageTemporaryUrl = undefined;
  if (!!backgroundImageBlobFileKey) {
    const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
      controller,
      blobItemPointer: {
        fileKey: backgroundImageBlobFileKey,
      },
    });
    if (getTemporaryImageUrlResponse.type === EitherType.failure) {
      return getTemporaryImageUrlResponse;
    }
    backgroundImageTemporaryUrl = getTemporaryImageUrlResponse.success;
  }

  //////////////////////////////////////////////////
  // Get Temporary Url for Profile Picture
  //////////////////////////////////////////////////

  let profilePictureTemporaryUrl = undefined;
  if (!!profilePictureBlobFileKey) {
    const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
      controller,
      blobItemPointer: {
        fileKey: profilePictureBlobFileKey,
      },
    });
    if (getTemporaryImageUrlResponse.type === EitherType.failure) {
      return getTemporaryImageUrlResponse;
    }
    profilePictureTemporaryUrl = getTemporaryImageUrlResponse.success;
  }

  //////////////////////////////////////////////////
  // Get Renderable Owner User
  //////////////////////////////////////////////////
  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId,
      userId: ownerUserId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: publishingChannelOwner } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Count of Users Following Publishing Channel
  //////////////////////////////////////////////////
  const countFollowersOfPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.countFollowersOfPublishingChannelId(
      {
        controller,
        publishingChannelIdBeingFollowed: publishingChannelId,
        areFollowsPending: false,
      },
    );

  if (countFollowersOfPublishingChannelIdResponse.type === EitherType.failure) {
    return countFollowersOfPublishingChannelIdResponse;
  }

  const { success: countOfUserFollowers } = countFollowersOfPublishingChannelIdResponse;

  //////////////////////////////////////////////////
  // Get Following Status of Client User to Publishing Channel
  //////////////////////////////////////////////////

  const getFollowingStatusOfUserIdToPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.getFollowingStatusOfUserIdToPublishingChannelId(
      {
        controller,
        publishingChannelIdBeingFollowed: publishingChannelId,
        userIdDoingFollowing: requestorUserId,
      },
    );

  if (
    getFollowingStatusOfUserIdToPublishingChannelIdResponse.type === EitherType.failure
  ) {
    return getFollowingStatusOfUserIdToPublishingChannelIdResponse;
  }

  const { success: followingStatusOfClientToPublishingChannel } =
    getFollowingStatusOfUserIdToPublishingChannelIdResponse;

  //////////////////////////////////////////////////
  // Read Moderator User Ids from DB
  //////////////////////////////////////////////////

  const selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.selectPublishingChannelModeratorUserIdsByPublishingChannelId(
      {
        controller,
        publishingChannelId,
      },
    );

  if (
    selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse.type ===
    EitherType.failure
  ) {
    return selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse;
  }

  const { success: moderatorUserIds } =
    selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable Moderator Users
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await assembleRenderableUsersByIds({
      controller,
      requestorUserId,
      userIds: moderatorUserIds,
      blobStorageService,
      databaseService,
    });

  if (constructRenderableUsersFromPartsByUserIdsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsByUserIdsResponse;
  }

  const { success: moderators } = constructRenderableUsersFromPartsByUserIdsResponse;

  //////////////////////////////////////////////////
  // Assemble RenderablePublishingChannel
  //////////////////////////////////////////////////

  const renderablePublishingChannel: RenderablePublishingChannel = {
    publishingChannelId,
    ownerUserId,
    name,
    description,
    publishingChannelRules,
    externalUrls,

    bannedWords,

    owner: publishingChannelOwner,

    moderators,

    backgroundImageTemporaryUrl,
    profilePictureTemporaryUrl,

    followingStatusOfClientToPublishingChannel,

    followers: {
      count: countOfUserFollowers,
    },
  };

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(renderablePublishingChannel);
}
