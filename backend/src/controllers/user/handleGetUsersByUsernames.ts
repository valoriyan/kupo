import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUsersFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export interface GetUsersByUsernamesRequestBody {
  usernames: string[];
}

export enum GetUsersByUsernamesFailedReason {
  NotFound = "User Not Found",
}

export interface GetUsersByUsernamesSuccess {
  users: (RenderableUser | null)[];
}

export async function handleGetUsersByUsernames({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUsersByUsernamesRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetUsersByUsernamesFailedReason>,
    GetUsersByUsernamesSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { usernames } = requestBody;

  const lowercaseUsernames = usernames.map((username) => username.toLowerCase());

  //////////////////////////////////////////////////
  // Read Users From DB
  //////////////////////////////////////////////////

  const selectUsersByUsernamesResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: lowercaseUsernames },
    );

  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUsernamesResponse;

  //////////////////////////////////////////////////
  // Assemble Users
  //////////////////////////////////////////////////

  const assembleRenderableUsersFromCachedComponentsResponse =
    await assembleRenderableUsersFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  if (assembleRenderableUsersFromCachedComponentsResponse.type === EitherType.failure) {
    return assembleRenderableUsersFromCachedComponentsResponse;
  }
  const { success: renderableUsers } =
    assembleRenderableUsersFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Map Results to Input Order
  //////////////////////////////////////////////////

  const usernameToUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.username, renderableUser]),
  );

  const foundUsers = lowercaseUsernames.map((username) => {
    if (usernameToUserMap.has(username)) {
      return usernameToUserMap.get(username)!;
    }
    return null;
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: foundUsers,
  });
}
