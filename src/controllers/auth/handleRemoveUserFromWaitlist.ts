import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "./utilities";
import { AuthController } from "./authController";

export interface RemoveUserFromWaitlistRequestBody {
  userIdToRemoveFromWaitlist: string;
}

export enum RemoveUserFromWaitlistFailedReason {
  NotFound = "User Not Found",
}

export interface RemoveUserFromWaitlistFailed {
  reason: RemoveUserFromWaitlistFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveUserFromWaitlistSuccess {}

export async function handleRemoveUserFromWaitlist({
  controller,
  request,
  requestBody,
}: {
  controller: AuthController;
  request: express.Request;
  requestBody: RemoveUserFromWaitlistRequestBody;
}): Promise<
  SecuredHTTPResponse<RemoveUserFromWaitlistFailed, RemoveUserFromWaitlistSuccess>
> {
  const { userIdToRemoveFromWaitlist } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const clientUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { userId: clientUserId },
    );

  if (!!clientUser && clientUser.isAdmin) {
    await controller.databaseService.tableNameToServicesMap.usersTableService.removeUserFromWaitlist(
      { userId: userIdToRemoveFromWaitlist },
    );
  } else {
    throw new Error("Client user does not have permission to modify waitlist");
  }

  return {};
}
