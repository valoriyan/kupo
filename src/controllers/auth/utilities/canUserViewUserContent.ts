import {
  ProfilePrivacySetting,
  UnrenderableUser,
} from "../../../controllers/user/models";
import { DatabaseService } from "../../../services/databaseService";

export async function canUserViewUserContent({
  clientUserId,
  targetUser,
  databaseService,
}: {
  clientUserId: string;
  targetUser: UnrenderableUser;
  databaseService: DatabaseService;
}): Promise<boolean> {
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public) {
    return true;
  }

  return await databaseService.tableNameToServicesMap.userFollowsTableService.isUserIdFollowingUserId(
    {
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: targetUser.userId,
    },
  );
}

export async function canUserViewUserContentByUserId({
  clientUserId,
  targetUserId,
  databaseService,
}: {
  clientUserId: string;
  targetUserId: string;
  databaseService: DatabaseService;
}): Promise<boolean> {
  const targetUser =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: targetUserId,
    });

  if (!targetUser) {
    throw new Error("Missing user");
  }

  return canUserViewUserContent({
    clientUserId,
    targetUser,
    databaseService,
  });
}
