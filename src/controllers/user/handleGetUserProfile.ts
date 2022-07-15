import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { AuthFailedReason } from "../auth/models";
import { getClientUserId } from "../auth/utilities";
import { RenderableUser, UnrenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export interface GetUserProfileRequestBody {
  username?: string;
}
export type GetUserProfileSuccess = RenderableUser;

export enum GetUserProfileFailedReason {
  Blocked = "Blocked",
  NotFound = "User Not Found",
}

export async function handleGetUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUserProfileRequestBody;
}): Promise<SecuredHTTPResponse<GetUserProfileFailedReason, GetUserProfileSuccess>> {
  // TODO: CHECK IF USER HAS ACCESS TO PROFILE
  // IF Private hide posts and shop
  const clientUserId = await getClientUserId(request);

  const { username } = requestBody;

  let unrenderableUser: UnrenderableUser | undefined;
  if (username) {
    const lowercaseUsername = username.toLowerCase();

    // Fetch user profile by given username
    unrenderableUser =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUsername(
        { username: lowercaseUsername },
      );
  } else {
    // Fetch user profile by own userId
    if (!clientUserId) {
      controller.setStatus(403);
      return { type: EitherType.error, error: { reason: AuthFailedReason.AuthorizationError } };
    }
    const unrenderableUsers =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
        { userIds: [clientUserId] },
      );
    unrenderableUser = unrenderableUsers[0];
  }

  if (!unrenderableUser) {
    controller.setStatus(404);
    return { type: EitherType.error, error: { reason: GetUserProfileFailedReason.NotFound } };
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    type: EitherType.success,
    success: renderableUser,
  };
}
