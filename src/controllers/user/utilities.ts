import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import { canUserViewUserContent } from "../auth/utilities/canUserViewUserContent";
import { RenderableUser, UnrenderableUser } from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  FailureResponse,
  InternalServiceResponse,
  Success,
  SuccessResponse,
} from "../../utilities/monads";
import { GenericResponseFailedReason } from "../models";

export async function constructRenderableUsersFromPartsByUserIds({
  controller,
  clientUserId,
  userIds,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string;
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
    clientUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}

export async function constructRenderableUserFromPartsByUserId({
  controller,
  clientUserId,
  userId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string;
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
      clientUserId,
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
  clientUserId,
  unrenderableUsers,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string;
  unrenderableUsers: UnrenderableUser[];
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  const constructRenderableUserFromPartsResponses = await BluebirdPromise.map(
    unrenderableUsers,
    async (unrenderableUser) =>
      await constructRenderableUserFromParts({
        controller,
        clientUserId,
        unrenderableUser,
        blobStorageService,
        databaseService,
      }),
  );

  const firstOccuringError = constructRenderableUserFromPartsResponses.find(
    (responseElement) => {
      return responseElement.type === EitherType.failure;
    },
  );
  if (firstOccuringError) {
    return firstOccuringError as FailureResponse<ErrorReasonTypes<string>>;
  }

  const renderableUsers = constructRenderableUserFromPartsResponses.map(
    (responseElement) => (responseElement as SuccessResponse<RenderableUser>).success,
  );

  return Success(renderableUsers);
}

export async function constructRenderableUserFromParts({
  controller,
  clientUserId,
  unrenderableUser,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string | undefined;
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

  const backgroundImageTemporaryUrl = !!backgroundImageBlobFileKey
    ? await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: backgroundImageBlobFileKey,
        },
      })
    : undefined;

  const profilePictureTemporaryUrl = !!profilePictureBlobFileKey
    ? await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: profilePictureBlobFileKey,
        },
      })
    : undefined;

  const canUserViewUserContentResponse = await canUserViewUserContent({
    controller,
    clientUserId,
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

  let isBeingFollowedByClient = false;
  if (!!clientUserId) {
    const isUserIdFollowingUserIdResponse =
      await databaseService.tableNameToServicesMap.userFollowsTableService.isUserIdFollowingUserId(
        {
          controller,
          userIdDoingFollowing: clientUserId,
          userIdBeingFollowed: userId,
        },
      );
    if (isUserIdFollowingUserIdResponse.type === EitherType.failure) {
      return isUserIdFollowingUserIdResponse;
    }
    isBeingFollowedByClient = isUserIdFollowingUserIdResponse.success;
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
    isBeingFollowedByClient,
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
  const setOfIncludedPostIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { userId } = element;
      if (!setOfIncludedPostIds.has(userId)) {
        setOfIncludedPostIds.add(userId);
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
}
