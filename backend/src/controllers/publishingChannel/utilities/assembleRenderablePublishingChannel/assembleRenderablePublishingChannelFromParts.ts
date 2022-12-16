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
  constructRenderableUserFromPartsByUserId,
  constructRenderableUsersFromPartsByUserIds,
} from "../../../user/utilities";
import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
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
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishingChannels: UnrenderablePublishingChannel[];
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel[]>
> {
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
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishingChannel: UnrenderablePublishingChannel;
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel>
> {
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
  // GET BACKGROUND IMAGE
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
  // GET PROFILE PICTURE
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
  // GET RENDERABLE OWNER USER
  //////////////////////////////////////////////////
  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
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
  // GET COUNT OF USERS FOLLOWING PUBLISHING CHANNEL
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
  // GET FOLLOWING STATUS OF USER TO PUBLISHING CHANNEL
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
  // GET MODERATORS
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

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await constructRenderableUsersFromPartsByUserIds({
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
  // COMPILE
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
  // RETURN
  //////////////////////////////////////////////////

  return Success(renderablePublishingChannel);
}
