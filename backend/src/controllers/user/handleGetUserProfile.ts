import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { getClientUserId } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUserFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export interface GetUserProfileRequestBody {
  username: string;
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
  const clientUserId = await getClientUserId(request);

  const { username } = requestBody;

  const lowercaseUsername = username.toLowerCase();

  const selectUserByUsernameResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUsername(
      { controller, username: lowercaseUsername },
    );
  if (selectUserByUsernameResponse.type === EitherType.failure) {
    return selectUserByUsernameResponse;
  }
  const unrenderableUser = selectUserByUsernameResponse.success;

  if (!unrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetUserProfileFailedReason.NotFound,
      error: "User not found at handleGetUserProfile",
      additionalErrorInformation: "User not found at handleGetUserProfile",
    });
  }

  const constructRenderableUserFromPartsResponse =
    await assembleRenderableUserFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  return constructRenderableUserFromPartsResponse;
}
