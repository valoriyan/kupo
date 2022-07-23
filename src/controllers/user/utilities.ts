import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import { canUserViewUserContent } from "../auth/utilities/canUserViewUserContent";
import { RenderableUser, UnrenderableUser } from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { GenericResponseFailedReason } from "../models";
import { UserFollowingStatus } from "../userInteraction/models";

export async function constructRenderableUsersFromPartsByUserIds({
  controller,
  requestorUserId,
  userIds,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  userIds: string[];
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  const unrenderableUsersResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      controller,
      userIds,
    });

  if (unrenderableUsersResponse.type === EitherType.failure) {
    return unrenderableUsersResponse;
  }
  const { success: unrenderableUsers } = unrenderableUsersResponse;

  return await constructRenderableUsersFromParts({
    controller,
    requestorUserId: requestorUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}

export async function constructRenderableUserFromPartsByUserId({
  controller,
  requestorUserId,
  userId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  userId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> {
  const unrenderableUserResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId,
    });

  if (unrenderableUserResponse.type === EitherType.failure) {
    return unrenderableUserResponse;
  }

  const { success: unrenderableUser } = unrenderableUserResponse;

  if (!!unrenderableUser) {
    return await constructRenderableUserFromParts({
      controller,
      requestorUserId: requestorUserId,
      unrenderableUser,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  } else {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at constructRenderableUserFromPartsByUserId",
      additionalErrorInformation: "Error at constructRenderableUserFromPartsByUserId",
    });
  }
}

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

  return collectMappedResponses({
    mappedResponses: constructRenderableUserFromPartsResponses,
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

  const canUserViewUserContentResponse = await canUserViewUserContent({
    controller,
    requestorUserId: requestorUserId,
    targetUser: unrenderableUser,
    databaseService,
  });
  if (canUserViewUserContentResponse.type === EitherType.failure) {
    return canUserViewUserContentResponse;
  }
  const { success: clientCanViewContent } = canUserViewUserContentResponse;

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

  const countFollowsOfUserIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countFollowsOfUserId(
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

  const getHashtagsForUserIdResponse =
    await databaseService.tableNameToServicesMap.userHashtagsTableService.getHashtagsForUserId(
      { controller, userId },
    );

  if (getHashtagsForUserIdResponse.type === EitherType.failure) {
    return getHashtagsForUserIdResponse;
  }

  const { success: userHashtags } = getHashtagsForUserIdResponse;

  let followingStatusOfClientToUser = UserFollowingStatus.not_following;
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

export function mergeArraysOfUnrenderableUsers({
  arrays,
}: {
  arrays: UnrenderableUser[][];
}) {
  const mergedArray: UnrenderableUser[] = [];
  const setOfIncludedPublishedItemIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { userId } = element;
      if (!setOfIncludedPublishedItemIds.has(userId)) {
        setOfIncludedPublishedItemIds.add(userId);
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
}
