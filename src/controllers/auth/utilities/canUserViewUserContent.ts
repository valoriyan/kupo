import { GenericResponseFailedReason } from "../../../controllers/models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import {
  ProfilePrivacySetting,
  UnrenderableUser,
} from "../../../controllers/user/models";
import { DatabaseService } from "../../../services/databaseService";

export async function canUserViewUserContent({
  controller,
  clientUserId,
  targetUser,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string | undefined;
  targetUser: UnrenderableUser;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public)
    return Success(true);
  if (!clientUserId) return Success(false);

  return await databaseService.tableNameToServicesMap.userFollowsTableService.isUserIdFollowingUserId(
    {
      controller,
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: targetUser.userId,
    },
  );
}

export async function canUserViewUserContentByUserId({
  controller,
  clientUserId,
  targetUserId,
  databaseService,
}: {
  controller: Controller;
  clientUserId: string | undefined;
  targetUserId: string;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
  const selectUsersByUserIdsResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      controller,
      userIds: [targetUserId],
    });

  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: targetUsers } = selectUsersByUserIdsResponse;

  const targetUser = targetUsers[0];

  if (!targetUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at canUserViewUserContentByUserId",
      additionalErrorInformation: "User not found at canUserViewUserContentByUserId",
    });
  }

  return canUserViewUserContent({
    controller,
    clientUserId,
    targetUser,
    databaseService,
  });
}
