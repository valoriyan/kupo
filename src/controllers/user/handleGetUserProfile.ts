import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser, UnrenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export interface GetUserProfileParams {
  username?: string;
}
export type SuccessfulGetUserProfileResponse = RenderableUser;

export enum DeniedGetUserProfileResponseReason {
  Blocked = "Blocked",
  NotFound = "User Not Found",
}

export interface DeniedGetUserProfileResponse {
  reason: DeniedGetUserProfileResponseReason;
}

export async function handleGetUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUserProfileParams;
}): Promise<
  SecuredHTTPResponse<DeniedGetUserProfileResponse, SuccessfulGetUserProfileResponse>
> {
  // TODO: CHECK IF USER HAS ACCESS TO PROFILE
  // IF Private hide posts and shop
  const { clientUserId, error } = await checkAuthorization(controller, request);

  let unrenderableUser: UnrenderableUser | undefined;
  if (requestBody.username) {
    // Fetch user profile by given username
    unrenderableUser =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUsername(
        {
          username: requestBody.username,
        },
      );
  } else {
    // Fetch user profile by own userId
    if (error) return error;
    const unrenderableUsers =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
        { userIds: [clientUserId] },
      );
    unrenderableUser = unrenderableUsers[0];
  }

  if (!unrenderableUser) {
    controller.setStatus(404);
    return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    success: renderableUser,
  };
}
