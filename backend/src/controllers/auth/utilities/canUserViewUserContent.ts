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
import { FollowingStatus } from "../../user/userInteraction/models";

export async function canUserIdViewUserContentFromUnrenderableUser({
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
          maybeExecutorUserId: targetUser.userId,
        },
      );
    if (isUserIdBlockedByUserIdResponse.type === EitherType.failure) {
      return isUserIdBlockedByUserIdResponse;
    }
    const { success: userIsBlocked } = isUserIdBlockedByUserIdResponse;

    if (userIsBlocked) {
      return Success(false);
    }
  }

  //////////////////////////////////////////////////
  // If target user has a public profile then profile is viewable
  //////////////////////////////////////////////////
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public)
    return Success(true);

  //////////////////////////////////////////////////
  // If target user has a private profile then requestor must be logged in
  //////////////////////////////////////////////////

  if (!requestorUserId) return Success(false);

  //////////////////////////////////////////////////
  // Check if requestor is following private user
  //////////////////////////////////////////////////
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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(userFollowingStatus === FollowingStatus.is_following);
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
  //////////////////////////////////////////////////
  // User has viewing rights to their own items
  //////////////////////////////////////////////////
  if (requestorUserId === targetUserId) {
    return Success(true);
  }

  //////////////////////////////////////////////////
  // Get targt user if target user exists
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: targetUserId,
      },
    );

  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUnrenderableUser } = selectMaybeUserByUserIdResponse;

  //////////////////////////////////////////////////
  // If target user does not exist, return error
  //////////////////////////////////////////////////

  if (!maybeUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at canUserViewUserContentByUserId",
      additionalErrorInformation: "User not found at canUserViewUserContentByUserId",
    });
  }
  const targetUser = maybeUnrenderableUser;

  //////////////////////////////////////////////////
  // If target user does exist, continue checking if user can view content
  //////////////////////////////////////////////////

  return canUserIdViewUserContentFromUnrenderableUser({
    controller,
    requestorUserId,
    targetUser,
    databaseService,
  });
}
