import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface UnfollowUserRequestBody {
  userIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyUnfollowedUserProfileResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUnfollowUserProfileResponse {}

export async function handleUnfollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UnfollowUserRequestBody;
}): Promise<
  HTTPResponse<
    FailedToUnfollowUserProfileResponse,
    SuccessfullyUnfollowedUserProfileResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.userFollowsTableService.deleteUserFollow(
    {
      userIdDoingUnfollowing: clientUserId,
      userIdBeingUnfollowed: requestBody.userIdBeingUnfollowed,
    },
  );
  return {};
}
