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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { cursor, userIdDoingFollowing, pageSize } = requestBody;

  //////////////////////////////////////////////////
  // Read User Ids Followed By Target User From DB
  //////////////////////////////////////////////////

  const getUserIdsFollowedByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowedByUserId(
      { controller, userIdDoingFollowing, areFollowsPending: false },
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

  //////////////////////////////////////////////////
  // Assemble RenderableUsers
  //////////////////////////////////////////////////

  const assembleRenderableUsersByIdsResponse = await assembleRenderableUsersByIds({
    controller,
    requestorUserId: clientUserId,
    userIds: userIdsBeingFollowed,
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
  // Results
  //////////////////////////////////////////////////

  return Success({
    users: pageOfRenderableUsers,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
