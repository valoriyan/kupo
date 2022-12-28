import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { AuthController } from "./authController";

export interface ElevateUserToAdminRequestBody {
  userIdElevatedToAdmin: string;
}

export enum ElevateUserToAdminFailedReason {
  NotFound = "User Not Found",
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
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
    ErrorReasonTypes<string | ElevateUserToAdminFailedReason>,
    ElevateUserToAdminSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { userIdElevatedToAdmin } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get User
  //////////////////////////////////////////////////

  const selectMaybeUserByUserId =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectMaybeUserByUserId.type === EitherType.failure) {
    return selectMaybeUserByUserId;
  }
  const { success: maybeUser } = selectMaybeUserByUserId;

  //////////////////////////////////////////////////
  // If Requestor User Exists and Requestor is Admin
  //////////////////////////////////////////////////
  if (!!maybeUser && maybeUser.isAdmin) {
    //////////////////////////////////////////////////
    // Elevate Target to Admin
    //////////////////////////////////////////////////
    const elevateUserToAdminResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.elevateUserToAdmin(
        { controller, userId: userIdElevatedToAdmin },
      );
    if (elevateUserToAdminResponse.type === EitherType.failure) {
      return elevateUserToAdminResponse;
    }
    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 403,
    reason: ElevateUserToAdminFailedReason.ILLEGAL_ACCESS,
    error:
      "Client user does not have permission to create admins at handleElevateUserToAdmin",
    additionalErrorInformation:
      "Client user does not have permission to create admins at handleElevateUserToAdmin",
  });
}
