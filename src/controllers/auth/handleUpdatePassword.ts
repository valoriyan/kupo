import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization, encryptPassword } from "../auth/utilities";
import { AuthController } from "./authController";

export interface UpdatePasswordRequestBody {
    updatedPassword: string;
}

export enum FailedToUpdatePasswordResponseReason {
  Unknown = "Unknown",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdatePasswordResponse {
  reason: FailedToUpdatePasswordResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyUpdatedPasswordResponse {}

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
  FailedToUpdatePasswordResponse,
  SuccessfullyUpdatedPasswordResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const encryptedPassword = encryptPassword({password: requestBody.updatedPassword});

  await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword({
    userId: clientUserId,
    encryptedPassword,
  });

  return {};
}
