/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  HTTPResponse,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { constructRenderableUserFromPartsByUserId } from "../user/utilities";
import { RenderableUser } from "../user/models";
import { Promise as BluebirdPromise } from "bluebird";

export interface GetFollowerRequestsRequestBody {}

export interface GetFollowerRequestsSuccess {
  users: RenderableUser[];
}
export interface GetFollowerRequestsFailed {}

export async function handleGetFollowerRequests({
  controller,
  request,
}: // requestBody,
{
  controller: UserInteractionController;
  request: express.Request;
  requestBody: GetFollowerRequestsRequestBody;
}): Promise<HTTPResponse<GetFollowerRequestsFailed, GetFollowerRequestsSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getUserIdsFollowingUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      { controller, userIdBeingFollowed: clientUserId, areFollowsPending: true },
    );
  if (getUserIdsFollowingUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowingUserIdResponse;
  }
  const { success: unrenderableUserFollows } = getUserIdsFollowingUserIdResponse;

  const constructRenderableUserFromPartsByUserIdResponses = await BluebirdPromise.map(
    unrenderableUserFollows,
    async (
      unrenderableUserFollow,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> => {
      const { userIdDoingFollowing } = unrenderableUserFollow;

      return await constructRenderableUserFromPartsByUserId({
        controller,
        requestorUserId: clientUserId,
        userId: userIdDoingFollowing,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
      });
    },
  );

  const mappedConstructRenderableUserFromPartsByUserIdResponses = collectMappedResponses({
    mappedResponses: constructRenderableUserFromPartsByUserIdResponses,
  });
  if (
    mappedConstructRenderableUserFromPartsByUserIdResponses.type === EitherType.failure
  ) {
    return mappedConstructRenderableUserFromPartsByUserIdResponses;
  }
  const { success: renderableUsers } =
    mappedConstructRenderableUserFromPartsByUserIdResponses;

  return Success({ users: renderableUsers });
}
