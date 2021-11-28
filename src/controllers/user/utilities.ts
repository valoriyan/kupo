import { LocalBlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import { canUserViewUserContent } from "../auth/utilities/canUserViewUserContent";
import { RenderableUser, UnrenderableUser } from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderableUsersFromParts({
  clientUserId,
  unrenderableUsers,
  blobStorageService,
  databaseService,
}: {
  clientUserId: string;
  unrenderableUsers: UnrenderableUser[];
  blobStorageService: LocalBlobStorageService;
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
  clientUserId: string;
  unrenderableUser: UnrenderableUser;
  blobStorageService: LocalBlobStorageService;
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
  };
}
