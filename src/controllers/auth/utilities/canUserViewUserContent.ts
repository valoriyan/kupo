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
  clientUserId: string | undefined;
  targetUser: UnrenderableUser;
  databaseService: DatabaseService;
}): Promise<boolean> {
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public) return true;
  if (!clientUserId) return false;

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
  clientUserId: string | undefined;
  targetUserId: string;
  databaseService: DatabaseService;
}): Promise<boolean> {
  const targetUsers =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      userIds: [targetUserId],
    });

  const targetUser = targetUsers[0];

  if (!targetUser) {
    throw new Error("Missing user");
  }

  return canUserViewUserContent({
    clientUserId,
    targetUser,
    databaseService,
  });
}
