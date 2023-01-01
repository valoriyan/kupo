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

export interface GetPageOfUsersFollowingUserIdRequestBody {
  userIdBeingFollowed: string;
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfUsersFollowingUserIdFailedReason {
  UnknownCause = "Unknown Cause",
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
    ErrorReasonTypes<string | GetPageOfUsersFollowingUserIdFailedReason>,
    GetPageOfUsersFollowingUserIdSuccess
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

  const { cursor, userIdBeingFollowed, pageSize } = requestBody;

  //////////////////////////////////////////////////
  // Get User Ids Following Target User
  //////////////////////////////////////////////////

  const getUserIdsFollowingUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      { controller, userIdBeingFollowed, areFollowsPending: false },
    );

  if (getUserIdsFollowingUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowingUserIdResponse;
  }
  const { success: unrenderableUserFollows } = getUserIdsFollowingUserIdResponse;

  const userIdsDoingFollowing = unrenderableUserFollows.map(
    ({ userIdDoingFollowing }) => userIdDoingFollowing,
  );

  if (userIdsDoingFollowing.length === 0) {
    return Success({
      users: [],
      previousPageCursor: cursor,
    });
  }

  //////////////////////////////////////////////////
  // Assemble User Ids
  //////////////////////////////////////////////////

  const assembleRenderableUsersByIdsResponse = await assembleRenderableUsersByIds({
    controller,
    requestorUserId: clientUserId,
    userIds: userIdsDoingFollowing,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });
  if (assembleRenderableUsersByIdsResponse.type === EitherType.failure) {
    return assembleRenderableUsersByIdsResponse;
  }
  const { success: renderableUsers } = assembleRenderableUsersByIdsResponse;

  //////////////////////////////////////////////////
  // Generate Page of Results
  //////////////////////////////////////////////////

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfRenderableUsers = renderableUsers.slice(startIndexForPage, endIndexForPage);

  const nextPageCursor =
    pageOfRenderableUsers.length === pageSize ? (pageNumber + 1).toString() : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: pageOfRenderableUsers,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
