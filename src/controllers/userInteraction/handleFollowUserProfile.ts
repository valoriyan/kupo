import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/authUtilities";
import { UserInteractionController } from "./userInteractionController";

export interface FollowUserProfileParams {
  userIdBeingFollowed: string;
}

export interface UnfollowUserProfileParams {
  userIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulFollowOfUserProfileResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToFollowUserProfileResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulUnfollowOfUserProfileResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUnfollowUserProfileResponse {}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserProfileParams;
}): Promise<
  HTTPResponse<FailedToFollowUserProfileResponse, SuccessfulFollowOfUserProfileResponse>
> {
  const { userId: clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableServices.userFollowsTableService.createUserFollow(
    {
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: requestBody.userIdBeingFollowed,
    },
  );
  return {};
}

export async function handleUnfollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UnfollowUserProfileParams;
}): Promise<
  HTTPResponse<
    FailedToUnfollowUserProfileResponse,
    SuccessfulUnfollowOfUserProfileResponse
  >
> {
  const { userId: clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableServices.userFollowsTableService.deleteUserFollow(
    {
      userIdDoingUnfollowing: clientUserId,
      userIdBeingUnfollowed: requestBody.userIdBeingUnfollowed,
    },
  );
  return {};
}
