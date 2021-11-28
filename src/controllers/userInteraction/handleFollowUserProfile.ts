import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface FollowUserProfileRequestBody {
  userIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyFollowedUserProfileResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToFollowUserProfileResponse {}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserProfileRequestBody;
}): Promise<
  HTTPResponse<FailedToFollowUserProfileResponse, SuccessfullyFollowedUserProfileResponse>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
    {
      userIdDoingFollowing: clientUserId,
      userIdBeingFollowed: requestBody.userIdBeingFollowed,
      timestamp: Date.now(),
    },
  );
  return {};
}
