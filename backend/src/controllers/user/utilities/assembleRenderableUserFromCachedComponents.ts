import { Promise as BluebirdPromise } from "bluebird";
import { GenericResponseFailedReason } from "../../models";
import { Controller } from "tsoa";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { RenderableUser, UnrenderableUser } from "../models";
import { FollowingStatus } from "../userInteraction/models";
import { canUserIdViewUserContentFromUnrenderableUser } from "../../auth/utilities/canUserIdViewUserContentFromUnrenderableUser";

export async function assembleRenderableUsersFromCachedComponents({
  controller,
  requestorUserId,
  unrenderableUsers,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  unrenderableUsers: UnrenderableUser[];
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  //////////////////////////////////////////////////
  // Assemble Each Renderable User
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponses = await BluebirdPromise.map(
    unrenderableUsers,
    async (unrenderableUser) =>
      await assembleRenderableUserFromCachedComponents({
        controller,
        requestorUserId: requestorUserId,
        unrenderableUser,
        blobStorageService,
        databaseService,
      }),
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return unwrapListOfEitherResponses({
    eitherResponses: constructRenderableUserFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderableUserFromCachedComponents({
  controller,
  requestorUserId,
  unrenderableUser,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  unrenderableUser: UnrenderableUser;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const {
    username,
    profilePrivacySetting,
    email,
    userId,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
    userWebsite,
    shortBio,
    preferredPagePrimaryColor,
    creationTimestamp,
    isAdmin,
    hasVerifiedEmail,
  } = unrenderableUser;

  //////////////////////////////////////////////////
  // Check If Requestor Is Blocked
  //      If Requestor is Logged in
  //////////////////////////////////////////////////

  if (!!requestorUserId) {
    const isUserIdBlockedByUserIdResponse =
      await databaseService.tableNameToServicesMap.userBlocksTableService.isUserIdBlockedByUserId(
        {
          controller,
          maybeBlockedUserId: requestorUserId,
          maybeExecutorUserId: userId,
        },
      );
    if (isUserIdBlockedByUserIdResponse.type === EitherType.failure) {
      return isUserIdBlockedByUserIdResponse;
    }
    const { success: userIsBlocked } = isUserIdBlockedByUserIdResponse;

    if (!!userIsBlocked) {
      return Failure({
        controller,
        httpStatusCode: 404,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found at assembleRenderableUserFromCachedComponents",
        additionalErrorInformation:
          "User not found at assembleRenderableUserFromCachedComponents",
      });
    }
  }

  //////////////////////////////////////////////////
  // Get Background Image Temporary Url
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
  // Get Profile Picture Temporary Url
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
  // Check Authorization
  //////////////////////////////////////////////////
  const canUserViewUserContentResponse =
    await canUserIdViewUserContentFromUnrenderableUser({
      controller,
      requestorUserId: requestorUserId,
      targetUser: unrenderableUser,
      databaseService,
    });
  if (canUserViewUserContentResponse.type === EitherType.failure) {
    return canUserViewUserContentResponse;
  }
  const { success: clientCanViewContent } = canUserViewUserContentResponse;

  //////////////////////////////////////////////////
  // Read Target User Follower Count From DB
  //////////////////////////////////////////////////
  const countFollowersOfUserIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countFollowersOfUserId(
      {
        controller,
        userIdBeingFollowed: userId,
        areFollowsPending: false,
      },
    );
  if (countFollowersOfUserIdResponse.type === EitherType.failure) {
    return countFollowersOfUserIdResponse;
  }
  const { success: numberOfFollowersOfUserId } = countFollowersOfUserIdResponse;

  //////////////////////////////////////////////////
  // Read Target User Following Count From DB
  //////////////////////////////////////////////////
  const countUserFollowsOfUserIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countUserFollowsOfUserId(
      {
        controller,
        userIdDoingFollowing: userId,
        areFollowsPending: false,
      },
    );
  if (countUserFollowsOfUserIdResponse.type === EitherType.failure) {
    return countUserFollowsOfUserIdResponse;
  }
  const { success: numberOfFollowsByUserId } = countUserFollowsOfUserIdResponse;

  //////////////////////////////////////////////////
  // Read Target Users Hashtags from DB
  //////////////////////////////////////////////////
  const getHashtagsForUserIdResponse =
    await databaseService.tableNameToServicesMap.userHashtagsTableService.getHashtagsForUserId(
      { controller, userId },
    );

  if (getHashtagsForUserIdResponse.type === EitherType.failure) {
    return getHashtagsForUserIdResponse;
  }

  const { success: userHashtags } = getHashtagsForUserIdResponse;

  //////////////////////////////////////////////////
  // Determine If Client Is Following the Target User
  //////////////////////////////////////////////////
  let followingStatusOfClientToUser = FollowingStatus.not_following;
  if (!!requestorUserId) {
    const getFollowingStatusOfUserIdToUserIdResponse =
      await databaseService.tableNameToServicesMap.userFollowsTableService.getFollowingStatusOfUserIdToUserId(
        {
          controller,
          userIdDoingFollowing: requestorUserId,
          userIdBeingFollowed: userId,
        },
      );
    if (getFollowingStatusOfUserIdToUserIdResponse.type === EitherType.failure) {
      return getFollowingStatusOfUserIdToUserIdResponse;
    }
    followingStatusOfClientToUser = getFollowingStatusOfUserIdToUserIdResponse.success;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////
  return Success({
    backgroundImageTemporaryUrl,
    profilePictureTemporaryUrl,
    followers: {
      count: numberOfFollowersOfUserId,
    },
    follows: {
      count: numberOfFollowsByUserId,
    },
    clientCanViewContent,
    userId,
    email,
    username,
    profilePrivacySetting,
    userWebsite,
    shortBio,
    hashtags: userHashtags,
    preferredPagePrimaryColor,
    followingStatusOfClientToUser,
    creationTimestamp,
    hasVerifiedEmail,
    isAdmin,
  });
}
