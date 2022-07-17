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

export interface GetPageOfUsersFollowedByUserIdRequestBody {
  userIdDoingFollowing: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfUsersFollowedByUserIdFailedReason {
  UnknownCause = "Unknown Cause",
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
    ErrorReasonTypes<string | GetPageOfUsersFollowedByUserIdFailedReason>,
    GetPageOfUsersFollowedByUserIdSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { cursor, userIdDoingFollowing, pageSize } = requestBody;

  const getUserIdsFollowedByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { controller, userIdDoingFollowing },
    );
  if (getUserIdsFollowedByUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowedByUserIdResponse;
  }
  const { success: userIdsBeingFollowed } = getUserIdsFollowedByUserIdResponse;

  if (userIdsBeingFollowed.length === 0) {
    // controller.setStatus(404);
    return Success({
      users: [],
      previousPageCursor: cursor,
    });
  }

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await constructRenderableUsersFromPartsByUserIds({
      controller,
      clientUserId,
      userIds: userIdsBeingFollowed,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });
  if (constructRenderableUsersFromPartsByUserIdsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsByUserIdsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsByUserIdsResponse;

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfRenderableUsers = renderableUsers.slice(startIndexForPage, endIndexForPage);

  const nextPageCursor =
    pageOfRenderableUsers.length === pageSize ? (pageNumber + 1).toString() : undefined;

  return Success({
    users: pageOfRenderableUsers,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
