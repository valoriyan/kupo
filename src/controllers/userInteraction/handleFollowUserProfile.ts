import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface FollowUserRequestBody {
  userIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyFollowedUserResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToFollowUserResponse {}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserRequestBody;
}): Promise<HTTPResponse<FailedToFollowUserResponse, SuccessfullyFollowedUserResponse>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
    {
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: requestBody.userIdBeingFollowed,
      timestamp: Date.now(),
    },
  );
  return {
    success: {},
  };
}
