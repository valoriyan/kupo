import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

export interface SearchUserProfilesByUsernameParams {
  searchString: string;
}

export interface SuccessfulSearchUserProfilesByUsernameResponse {
  results: RenderableUser[];
}

export enum FailedToSearchUserProfilesByUsernameResponseReason {
  NotFound = "User Not Found",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToSearchUserProfilesByUsernameResponse {
  reason: FailedToSearchUserProfilesByUsernameResponseReason;
}

export async function handleSearchUserProfilesByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SearchUserProfilesByUsernameParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToSearchUserProfilesByUsernameResponse,
    SuccessfulSearchUserProfilesByUsernameResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { searchString } = requestBody;

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        usernameSubstring: searchString,
      },
    );

  if (unrenderableUsers.length === 0) {
    controller.setStatus(404);
    return {
      error: { reason: FailedToSearchUserProfilesByUsernameResponseReason.NotFound },
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
