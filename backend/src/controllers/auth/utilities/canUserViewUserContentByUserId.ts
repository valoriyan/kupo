import { GenericResponseFailedReason } from "../../models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../services/databaseService";
import { canUserIdViewUserContentFromUnrenderableUser } from "./canUserIdViewUserContentFromUnrenderableUser";

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
  // Return Yes if the Target User is the Requestor
  //////////////////////////////////////////////////
  if (requestorUserId === targetUserId) {
    return Success(true);
  }

  //////////////////////////////////////////////////
  // Get Target User
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
  // If Target User Does Exist
  //     Continue Checking if User Can View Content
  //////////////////////////////////////////////////

  return canUserIdViewUserContentFromUnrenderableUser({
    controller,
    requestorUserId,
    targetUser,
    databaseService,
  });
}
