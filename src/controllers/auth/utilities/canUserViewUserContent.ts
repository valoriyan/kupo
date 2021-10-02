import { ProfilePrivacySetting } from "../../../controllers/user/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUser } from "../../../services/databaseService/tableServices/usersTableService";

export async function canUserViewUserContent({
  clientUserId,
  targetUser,
  databaseService,
}: {
  clientUserId: string;
  targetUser: DBUser;
  databaseService: DatabaseService;
}): Promise<boolean> {
  if (targetUser.profile_privacy_setting === ProfilePrivacySetting.Public) {
    return true;
  }

  return await databaseService.tableServices.userFollowsTableService.isUserIdFollowingUserId(
    {
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: targetUser.id,
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
    await databaseService.tableServices.usersTableService.selectUserByUserId({
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
