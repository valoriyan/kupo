import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

export interface GetPageOfUsersFollowingUserIdRequestBody {
  userIdBeingFollowed: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfUsersFollowingUserIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfUsersFollowingUserIdFailed {
  reason: GetPageOfUsersFollowingUserIdFailedReason;
}

export interface GetPageOfUsersFollowingUserIdSuccess {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfUsersFollowingUserId({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetPageOfUsersFollowingUserIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetPageOfUsersFollowingUserIdFailed,
    GetPageOfUsersFollowingUserIdSuccess
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, userIdBeingFollowed, pageSize } = requestBody;

  const unrenderableUserFollows =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      { userIdBeingFollowed },
    );

  const userIdsDoingFollowing = unrenderableUserFollows.map(
    ({ userIdDoingFollowing }) => userIdDoingFollowing,
  );

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { userIds: userIdsDoingFollowing },
    );

  if (unrenderableUsers.length === 0) {
    // controller.setStatus(404);
    return {
      success: {
        users: [],
        previousPageCursor: cursor,
      },
    };
  }

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfRenderableUsers = renderableUsers.slice(startIndexForPage, endIndexForPage);

  return {
    success: {
      users: pageOfRenderableUsers,
      previousPageCursor: cursor,
      nextPageCursor: (pageNumber + 1).toString(),
    },
  };
}