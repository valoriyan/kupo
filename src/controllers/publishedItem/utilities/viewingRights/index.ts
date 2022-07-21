/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../../services/databaseService";
import { UncompiledBasePublishedItem } from "../../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { ProfilePrivacySetting } from "../../../user/models";
import { AuthFailedReason } from "../../../auth/models";

export async function assertViewingRightsOnPublishedItem({
  controller,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  const { authorUserId } = uncompiledBasePublishedItem;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: authorUserId,
    });

  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderablePublishedItemAuthor } = selectUserByUserIdResponse;

  if (!unrenderablePublishedItemAuthor) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at checkViewingRightsOnPublishedItem",
      additionalErrorInformation: "User not found at checkViewingRightsOnPublishedItem",
    });
  }

  if (
    unrenderablePublishedItemAuthor.profilePrivacySetting === ProfilePrivacySetting.Public
  ) {
    return Success(true);
  }

  if (!!requestorUserId) {
    const isUserIdFollowingUserIdResponse =
      await databaseService.tableNameToServicesMap.userFollowsTableService.isUserIdFollowingUserId(
        {
          controller,
          userIdDoingFollowing: requestorUserId,
          userIdBeingFollowed: authorUserId,
        },
      );

    if (isUserIdFollowingUserIdResponse.type === EitherType.failure) {
      return isUserIdFollowingUserIdResponse;
    }
    const { success: isUserIdFollowingUserId } = isUserIdFollowingUserIdResponse;

    if (isUserIdFollowingUserId) {
      return Success({});
    }
  }

  return Failure({
    controller,
    httpStatusCode: 404,
    reason: AuthFailedReason.IllegalAccess,
    error: "User not permitted to view item",
    additionalErrorInformation: "User not permitted to view item",
  });
}
