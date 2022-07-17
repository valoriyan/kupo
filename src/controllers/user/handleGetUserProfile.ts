import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../utilities/monads";
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetUserProfileFailedReason>,
    GetUserProfileSuccess
  >
> {
  // TODO: CHECK IF USER HAS ACCESS TO PROFILE
  // IF Private hide posts and shop
  const clientUserId = await getClientUserId(request);

  const { username } = requestBody;

  let unrenderableUser: UnrenderableUser | undefined;
  if (username) {
    const lowercaseUsername = username.toLowerCase();

    // Fetch user profile by given username
    const selectUserByUsernameResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUsername(
        { controller, username: lowercaseUsername },
      );
    if (selectUserByUsernameResponse.type === EitherType.failure) {
      return selectUserByUsernameResponse;
    }
    unrenderableUser = selectUserByUsernameResponse.success;
  } else {
    // Fetch user profile by own userId
    if (!clientUserId) {
      return Failure({
        controller,
        httpStatusCode: 403,
        reason: AuthFailedReason.AuthorizationError,
        error: "Unauthorized at handleGetUserProfile",
        additionalErrorInformation: "Unauthorized at handleGetUserProfile",
      });
    }
    const selectUsersByUserIdsResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
        { controller, userIds: [clientUserId] },
      );
    if (selectUsersByUserIdsResponse.type === EitherType.failure) {
      return selectUsersByUserIdsResponse;
    }
    const { success: unrenderableUsers } = selectUsersByUserIdsResponse;
    unrenderableUser = unrenderableUsers[0];
  }

  if (!unrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetUserProfileFailedReason.NotFound,
      error: "User not found at handleGetUserProfile",
      additionalErrorInformation: "User not found at handleGetUserProfile",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
      unrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    },
  );

  return constructRenderableUserFromPartsResponse;
}
