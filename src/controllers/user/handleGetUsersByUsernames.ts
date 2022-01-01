import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

export interface GetUsersByUsernamesRequestBody {
  usernames: string[];
}

export enum FailedToGetUsersByUsernamesResponseReason {
  NotFound = "User Not Found",
}

export interface FailedToGetUsersByUsernamesResponse {
  reason: FailedToGetUsersByUsernamesResponseReason;
}

export interface SuccessfullyGotUsersByUsernamesRequestBodyResponse {
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
    FailedToGetUsersByUsernamesResponse,
    SuccessfullyGotUsersByUsernamesRequestBodyResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { usernames } = requestBody;

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { usernames },
    );

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const usernameToUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.username, renderableUser]),
  );

  const foundUsers = usernames.map((username) => {
    if (usernameToUserMap.has(username)) {
      return usernameToUserMap.get(username)!;
    }
    return null;
  });

  return {
    success: {
      users: foundUsers,
    },
  };
}
