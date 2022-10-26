import { Promise as BluebirdPromise } from "bluebird";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { Controller } from "tsoa";
import { canUserIdViewUserContentFromUnrenderableUser } from "../../../controllers/auth/utilities/canUserViewUserContent";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
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

export async function constructRenderableUsersFromParts({
  controller,
  requestorUserId,
  unrenderableUsers,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  unrenderableUsers: UnrenderableUser[];
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  const constructRenderableUserFromPartsResponses = await BluebirdPromise.map(
    unrenderableUsers,
    async (unrenderableUser) =>
      await constructRenderableUserFromParts({
        controller,
        requestorUserId: requestorUserId,
        unrenderableUser,
        blobStorageService,
        databaseService,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: constructRenderableUserFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function constructRenderableUserFromParts({
  controller,
  requestorUserId,
  unrenderableUser,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  unrenderableUser: UnrenderableUser;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> {
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
  } = unrenderableUser;

  //////////////////////////////////////////////////
  // Check User If Requestor Is Blocked
  //      If requestor is logged in
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
        error: "User not found at constructRenderableUserFromParts",
        additionalErrorInformation: "User not found at constructRenderableUserFromParts",
      });
    }
  }

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
  // CHECK IF CLIENT CAN VIEW ITEMS PUBLISHED BY USER
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
  // GET FOLLOWER COUNT
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
  // HOW MANY ACCOUNTS IS THIS USER FOLLOWING
  //////////////////////////////////////////////////
  const countFollowsOfUserIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countUserFollowsOfUserId(
      {
        controller,
        userIdDoingFollowing: userId,
        areFollowsPending: false,
      },
    );
  if (countFollowsOfUserIdResponse.type === EitherType.failure) {
    return countFollowsOfUserIdResponse;
  }
  const { success: numberOfFollowsByUserId } = countFollowsOfUserIdResponse;

  //////////////////////////////////////////////////
  // GET USER HASHTAGS
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
  // IS CLIENT FOLLOWING USER
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
  // RETURN
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
    isAdmin,
  });
}
