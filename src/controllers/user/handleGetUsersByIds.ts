import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

export interface GetUsersByIdsRequestBody {
  userIds: string[];
}

export enum FailedToGetUsersByIdsResponseReason {
  NotFound = "User Not Found",
}

export interface FailedToGetUsersByIdsResponse {
  reason: FailedToGetUsersByIdsResponseReason;
}

export interface SuccessfullyGotUsersByIdsRequestBodyResponse {
  users: RenderableUser[];
}

export async function handleGetUsersByIds({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUsersByIdsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetUsersByIdsResponse,
    SuccessfullyGotUsersByIdsRequestBodyResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { userIds } = requestBody;

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { userIds },
    );

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    success: {
      users: renderableUsers,
    },
  };
}
