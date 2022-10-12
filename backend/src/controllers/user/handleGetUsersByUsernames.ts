import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities/constructRenderableUserFromParts";

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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { usernames } = requestBody;

  const lowercaseUsernames = usernames.map((username) => username.toLowerCase());

  const selectUsersByUsernamesResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: lowercaseUsernames },
    );

  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUsernamesResponse;

  const constructRenderableUsersFromPartsResponse =
    await constructRenderableUsersFromParts({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  if (constructRenderableUsersFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsResponse;

  const usernameToUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.username, renderableUser]),
  );

  const foundUsers = lowercaseUsernames.map((username) => {
    if (usernameToUserMap.has(username)) {
      return usernameToUserMap.get(username)!;
    }
    return null;
  });

  return Success({
    users: foundUsers,
  });
}
