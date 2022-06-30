import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

export interface SearchUserProfilesByUsernameRequestBody {
  searchString: string;
}

export interface SearchUserProfilesByUsernameSuccess {
  results: RenderableUser[];
}

export enum SearchUserProfilesByUsernameFailedReason {
  NotFound = "User Not Found",
}


export async function handleSearchUserProfilesByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SearchUserProfilesByUsernameRequestBody;
}): Promise<
  SecuredHTTPResponse<
  SearchUserProfilesByUsernameFailedReason,
    SearchUserProfilesByUsernameSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { searchString } = requestBody;

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        usernameSubstring: searchString.toLowerCase(),
      },
    );

  if (unrenderableUsers.length === 0) {
    controller.setStatus(404);
    return {
      error: { reason: SearchUserProfilesByUsernameFailedReason.NotFound },
    };
  }

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    success: {
      results: renderableUsers,
    },
  };
}
