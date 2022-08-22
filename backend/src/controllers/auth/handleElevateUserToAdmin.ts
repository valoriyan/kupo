import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { AuthController } from "./authController";

export interface ElevateUserToAdminRequestBody {
  userIdElevatedToAdmin: string;
}

export enum ElevateUserToAdminFailedReason {
  NotFound = "User Not Found",
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
}

export interface ElevateUserToAdminFailed {
  reason: ElevateUserToAdminFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ElevateUserToAdminSuccess {}

export async function handleElevateUserToAdmin({
  controller,
  request,
  requestBody,
}: {
  controller: AuthController;
  request: express.Request;
  requestBody: ElevateUserToAdminRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | ElevateUserToAdminFailed>,
    ElevateUserToAdminSuccess
  >
> {
  const { userIdElevatedToAdmin } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const selectUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: clientUser } = selectUserByUserIdResponse;

  if (!!clientUser && clientUser.isAdmin) {
    const elevateUserToAdminResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.elevateUserToAdmin(
        { controller, userId: userIdElevatedToAdmin },
      );
    if (elevateUserToAdminResponse.type === EitherType.failure) {
      return elevateUserToAdminResponse;
    }
  } else {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: ElevateUserToAdminFailedReason.ILLEGAL_ACCESS,
      error:
        "Client user does not have permission to create admins at handleElevateUserToAdmin",
      additionalErrorInformation:
        "Client user does not have permission to create admins at handleElevateUserToAdmin",
    });
  }

  return Success({});
}
