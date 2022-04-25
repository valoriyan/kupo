import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { AuthController } from "./authController";

export interface ElevateUserToAdminRequestBody {
  userIdElevatedToAdmin: string;
}

export enum ElevateUserToAdminFailedReason {
  NotFound = "User Not Found",
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
}): Promise<SecuredHTTPResponse<ElevateUserToAdminFailed, ElevateUserToAdminSuccess>> {
  const { userIdElevatedToAdmin } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const clientUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { userId: clientUserId },
    );

  if (!!clientUser && clientUser.isAdmin) {
    await controller.databaseService.tableNameToServicesMap.usersTableService.elevateUserToAdmin(
      { userId: userIdElevatedToAdmin },
    );
  } else {
    throw new Error("Client user does not have permission to create admins");
  }

  return {};
}
