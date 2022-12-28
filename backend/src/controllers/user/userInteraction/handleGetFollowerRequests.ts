/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { assembleRenderableUsersByIds } from "../utilities/assembleRenderableUserById";
import { RenderableUser } from "../models";
import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { getNextPageCursorOfPage } from "../../publishedItem/utilities/pagination";

export interface GetFollowerRequestsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface GetFollowerRequestsSuccess {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetFollowerRequestsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetFollowerRequests({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: GetFollowerRequestsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetFollowerRequestsFailedReason>,
    GetFollowerRequestsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Get User Ids Following Client
  //////////////////////////////////////////////////

  const getUserIdsFollowingUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      {
        controller,
        userIdBeingFollowed: clientUserId,
        areFollowsPending: true,
        createdBeforeTimestamp: pageTimestamp,
        limit: pageSize,
      },
    );
  if (getUserIdsFollowingUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowingUserIdResponse;
  }
  const { success: unrenderableUserFollows } = getUserIdsFollowingUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable Users Following Client
  //////////////////////////////////////////////////
  const userIdsFollowingClient = unrenderableUserFollows.map(
    ({ userIdDoingFollowing }) => userIdDoingFollowing,
  );

  const assembleRenderableUsersByIdsResponse = await assembleRenderableUsersByIds({
    controller,
    requestorUserId: clientUserId,
    userIds: userIdsFollowingClient,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });
  if (assembleRenderableUsersByIdsResponse.type === EitherType.failure) {
    return assembleRenderableUsersByIdsResponse;
  }
  const { success: renderableUsers } = assembleRenderableUsersByIdsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: renderableUsers,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getNextPageCursorOfPage({
      items: renderableUsers,
      getTimestampFromItem: (user: RenderableUser) => {
        const { timestamp } = unrenderableUserFollows.find(
          ({ userIdDoingFollowing }) => userIdDoingFollowing === user.userId,
        )!;
        return encodeTimestampCursor({ timestamp });
      },
    }),
  });
}
