import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization, encryptPassword } from "./utilities";
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
  const { clientUserId, errorResponse: errorResponseWithSetHttpStatusCode } =
    await checkAuthorization(controller, request);
  if (errorResponseWithSetHttpStatusCode) return errorResponseWithSetHttpStatusCode;

  const encryptedPassword = encryptPassword({ password: requestBody.updatedPassword });

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

  return Success({});
}
