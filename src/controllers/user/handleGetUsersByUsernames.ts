import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

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
  SecuredHTTPResponse<GetUsersByUsernamesFailedReason, GetUsersByUsernamesSuccess>
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { usernames } = requestBody;

  const lowercaseUsernames = usernames.map((username) => username.toLowerCase());

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { usernames: lowercaseUsernames },
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

  const foundUsers = lowercaseUsernames.map((username) => {
    if (usernameToUserMap.has(username)) {
      return usernameToUserMap.get(username)!;
    }
    return null;
  });

  return {
    type: EitherType.success,
    success: {
      users: foundUsers,
    },
  };
}
