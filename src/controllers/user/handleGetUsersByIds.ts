import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromPartsByUserIds } from "./utilities";

export interface GetUsersByIdsRequestBody {
  userIds: string[];
}

export enum GetUsersByIdsFailedReason {
  NotFound = "User Not Found",
}

export interface GetUsersByIdsFailed {
  reason: GetUsersByIdsFailedReason;
}

export interface GetUsersByIdsSuccess {
  users: (RenderableUser | null)[];
}

export async function handleGetUsersByIds({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUsersByIdsRequestBody;
}): Promise<SecuredHTTPResponse<GetUsersByIdsFailed, GetUsersByIdsSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { userIds } = requestBody;

  const renderableUsers = await constructRenderableUsersFromPartsByUserIds({
    clientUserId,
    userIds,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const foundUsers = userIds.map((userId) => {
    const foundUser = renderableUsers.find(
      (renderableUser) => renderableUser.userId === userId,
    );
    return !!foundUser ? foundUser : null;
  });

  return {
    success: {
      users: foundUsers,
    },
  };
}
