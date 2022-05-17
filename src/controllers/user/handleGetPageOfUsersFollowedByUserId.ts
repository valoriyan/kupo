import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromPartsByUserIds } from "./utilities";

export interface GetPageOfUsersFollowedByUserIdRequestBody {
  userIdDoingFollowing: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfUsersFollowedByUserIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfUsersFollowedByUserIdFailed {
  reason: GetPageOfUsersFollowedByUserIdFailedReason;
}

export interface GetPageOfUsersFollowedByUserIdSuccess {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfUsersFollowedByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetPageOfUsersFollowedByUserIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetPageOfUsersFollowedByUserIdFailed,
    GetPageOfUsersFollowedByUserIdSuccess
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, userIdDoingFollowing, pageSize } = requestBody;

  const userIdsBeingFollowed =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { userIdDoingFollowing },
    );

  if (userIdsBeingFollowed.length === 0) {
    // controller.setStatus(404);
    return {
      success: {
        users: [],
        previousPageCursor: cursor,
      },
    };
  }

  const renderableUsers = await constructRenderableUsersFromPartsByUserIds({
    clientUserId,
    userIds: userIdsBeingFollowed,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfRenderableUsers = renderableUsers.slice(startIndexForPage, endIndexForPage);

  const nextPageCursor =
    pageOfRenderableUsers.length === pageSize ? (pageNumber + 1).toString() : undefined;

  return {
    success: {
      users: pageOfRenderableUsers,
      previousPageCursor: cursor,
      nextPageCursor,
    },
  };
}
