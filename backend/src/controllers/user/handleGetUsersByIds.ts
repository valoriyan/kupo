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
import { assembleRenderableUsersByIds } from "./utilities/assembleRenderableUserById";

export interface GetUsersByIdsRequestBody {
  userIds: string[];
}

export enum GetUsersByIdsFailedReason {
  NotFound = "User Not Found",
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetUsersByIdsFailedReason>,
    GetUsersByIdsSuccess
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

  const { userIds } = requestBody;

  //////////////////////////////////////////////////
  // Assemble Users
  //////////////////////////////////////////////////

  const assembleRenderableUsersByIdsResponse = await assembleRenderableUsersByIds({
    controller,
    requestorUserId: clientUserId,
    userIds,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  if (assembleRenderableUsersByIdsResponse.type === EitherType.failure) {
    return assembleRenderableUsersByIdsResponse;
  }
  const { success: renderableUsers } = assembleRenderableUsersByIdsResponse;

  //////////////////////////////////////////////////
  // Map Users to Order of Inputs
  //////////////////////////////////////////////////

  const foundUsers = userIds.map((userId) => {
    const foundUser = renderableUsers.find(
      (renderableUser) => renderableUser.userId === userId,
    );
    return !!foundUser ? foundUser : null;
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: foundUsers,
  });
}
