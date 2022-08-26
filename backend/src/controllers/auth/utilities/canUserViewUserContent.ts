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
import { UserFollowingStatus } from "../../user/userInteraction/models";

export async function canUserViewUserContent({
  controller,
  requestorUserId,
  targetUser,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  targetUser: UnrenderableUser;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public)
    return Success(true);
  if (!requestorUserId) return Success(false);

  const getFollowingStatusOfUserIdToUserIdResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.getFollowingStatusOfUserIdToUserId(
      {
        controller,
        userIdDoingFollowing: requestorUserId,
        userIdBeingFollowed: targetUser.userId,
      },
    );

  if (getFollowingStatusOfUserIdToUserIdResponse.type === EitherType.failure) {
    return getFollowingStatusOfUserIdToUserIdResponse;
  }
  const { success: userFollowingStatus } = getFollowingStatusOfUserIdToUserIdResponse;

  return Success(userFollowingStatus === UserFollowingStatus.is_following);
}

export async function canUserViewUserContentByUserId({
  controller,
  requestorUserId,
  targetUserId,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  targetUserId: string;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
  if (requestorUserId === targetUserId) {
    return Success(true);
  }

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
    requestorUserId: requestorUserId,
    targetUser,
    databaseService,
  });
}
