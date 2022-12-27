import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { ProfilePrivacySetting, UnrenderableUser } from "../../user/models";
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
  // If Requestor Is Logged In
  //////////////////////////////////////////////////

  if (!!requestorUserId) {
    //////////////////////////////////////////////////
    // Check if Requestor Is Blocked By Target User
    //////////////////////////////////////////////////

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
      //////////////////////////////////////////////////
      // Return if Requestor Is Blocked By Target User
      // and Logged In
      //////////////////////////////////////////////////
      return Success(false);
    }
  }

  //////////////////////////////////////////////////
  // If Target User Has a Public Profile Then
  // the Target User Profile is Viewable
  //////////////////////////////////////////////////
  if (targetUser.profilePrivacySetting === ProfilePrivacySetting.Public)
    return Success(true);

  //////////////////////////////////////////////////
  // Return if Target User Has a Private Profile
  // and if the Requestor is not Logged In
  //////////////////////////////////////////////////

  if (!requestorUserId) return Success(false);

  //////////////////////////////////////////////////
  // Determine if the Requestor is Following the
  // Targeted Private User
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
