import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization, encryptPassword } from "./utilities";
import { AuthController } from "./authController";

export interface UpdatePasswordRequestBody {
  updatedPassword: string;
}

export enum UpdatePasswordFailedReason {
  Unknown = "Unknown",
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
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const encryptedPassword = encryptPassword({ password: requestBody.updatedPassword });

  await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
    {
      userId: clientUserId,
      encryptedPassword,
    },
  );

  return {};
}
