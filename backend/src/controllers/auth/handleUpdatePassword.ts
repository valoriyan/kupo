import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication, encryptPassword } from "./utilities";
import { AuthController } from "./authController";

export interface UpdatePasswordRequestBody {
  updatedPassword: string;
}

export enum UpdatePasswordFailedReason {
  Unknown = "Unknown",
  DatabaseFailure = "Database Error",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePasswordSuccess {}

export async function handleUpdatePassword({
  controller,
  request,
  requestBody,
}: {
  controller: AuthController;
  request: express.Request;
  requestBody: UpdatePasswordRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdatePasswordFailedReason>,
    UpdatePasswordSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: errorResponseWithSetHttpStatusCode } =
    await checkAuthentication(controller, request);
  if (errorResponseWithSetHttpStatusCode) return errorResponseWithSetHttpStatusCode;

  const encryptedPassword = encryptPassword({ password: requestBody.updatedPassword });

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

  const updateUserPasswordResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
      {
        controller,
        userId: clientUserId,
        encryptedPassword,
      },
    );
  if (updateUserPasswordResponse.type === EitherType.failure) {
    return updateUserPasswordResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
