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
import { constructRenderableUsersFromPartsByUserIds } from "./utilities";

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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { userIds } = requestBody;

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await constructRenderableUsersFromPartsByUserIds({
      controller,
      requestorUserId: clientUserId,
      userIds,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  if (constructRenderableUsersFromPartsByUserIdsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsByUserIdsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsByUserIdsResponse;

  const foundUsers = userIds.map((userId) => {
    const foundUser = renderableUsers.find(
      (renderableUser) => renderableUser.userId === userId,
    );
    return !!foundUser ? foundUser : null;
  });

  return Success({
    users: foundUsers,
  });
}
