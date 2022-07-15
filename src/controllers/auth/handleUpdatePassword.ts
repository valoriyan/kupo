import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization, encryptPassword } from "./utilities";
import { AuthController } from "./authController";
import { generateErrorResponse } from "../utilities/generateErrorResponse";
import { GenericResponseFailedReason } from "../models";

export interface UpdatePasswordRequestBody {
  updatedPassword: string;
}

export enum UpdatePasswordFailedReason {
  Unknown = "Unknown",
  DatabaseFailure = "Database Error",
}

export interface UpdatePasswordFailed {
  reason: UpdatePasswordFailedReason;
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
}): Promise<SecuredHTTPResponse<UpdatePasswordFailed, UpdatePasswordSuccess>> {
  const { clientUserId, errorResponse: errorResponseWithSetHttpStatusCode } =
    await checkAuthorization(controller, request);
  if (errorResponseWithSetHttpStatusCode) return errorResponseWithSetHttpStatusCode;

  const encryptedPassword = encryptPassword({ password: requestBody.updatedPassword });

  try {
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
      {
        userId: clientUserId,
        encryptedPassword,
      },
    );
  } catch (error) {
    return generateErrorResponse({
      controller,
      errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      additionalErrorInformation: "Error at usersTableService.updateUserPassword",
      error,
      httpStatusCode: 500,
    });
  }

  return { type: EitherType.success, success: {} };
}
