import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import { canUserViewUserContent } from "../auth/utilities/canUserViewUserContent";
import { RenderableUser, UnrenderableUser } from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderableUsersFromPartsByUserIds({
  clientUserId,
  userIds,
  blobStorageService,
  databaseService,
}: {
  clientUserId: string;
  userIds: string[];
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<RenderableUser[]> {
  const unrenderableUsers =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      userIds,
    });

  return await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}

export async function constructRenderableUserFromPartsByUserId({
  clientUserId,
  userId,
  blobStorageService,
  databaseService,
}: {
  clientUserId: string;
  userId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<RenderableUser> {
  const unrenderableUser =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId,
    });

  if (!!unrenderableUser) {
    return await constructRenderableUserFromParts({
      clientUserId,
      unrenderableUser,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  } else {
    throw new Error("Missing userId");
  }
}

export async function constructRenderableUsersFromParts({
  clientUserId,
  unrenderableUsers,
  blobStorageService,
  databaseService,
}: {
  clientUserId: string;
  unrenderableUsers: UnrenderableUser[];
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<RenderableUser[]> {
  const renderableUsers = await BluebirdPromise.map(
    unrenderableUsers,
    async (unrenderableUser) =>
      await constructRenderableUserFromParts({
        clientUserId,
        unrenderableUser,
        blobStorageService,
        databaseService,
      }),
  );

  return renderableUsers;
}

export async function constructRenderableUserFromParts({
  clientUserId,
  unrenderableUser,
  blobStorageService,
  databaseService,
}: {
  clientUserId: string | undefined;
  unrenderableUser: UnrenderableUser;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<RenderableUser> {
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

  const clientCanViewContent = await canUserViewUserContent({
    clientUserId,
    targetUser: unrenderableUser,
    databaseService,
  });

  const numberOfFollowersOfUserId: number =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countFollowersOfUserId(
      {
        userIdBeingFollowed: userId,
      },
    );

  const numberOfFollowsByUserId: number =
    await databaseService.tableNameToServicesMap.userFollowsTableService.countFollowsOfUserId(
      {
        userIdDoingFollowing: userId,
      },
    );

  const userHashtags =
    await databaseService.tableNameToServicesMap.userHashtagsTableService.getHashtagsForUserId(
      { userId },
    );

  const isBeingFollowedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.userFollowsTableService.isUserIdFollowingUserId(
      {
        userIdDoingFollowing: clientUserId,
        userIdBeingFollowed: userId,
      },
    ));

  return {
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
  };
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
