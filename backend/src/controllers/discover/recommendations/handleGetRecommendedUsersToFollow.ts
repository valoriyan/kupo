import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthentication } from "../../auth/utilities";
import { RenderableUser } from "../../user/models";
import { assembleRenderableUsersFromCachedComponents } from "../../../controllers/user/utilities/assembleRenderableUserFromCachedComponents";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetRecommendedUsersToFollowRequestBody {}

export enum GetRecommendedUsersToFollowFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetRecommendedUsersToFollowSuccess {
  users: RenderableUser[];
}

export async function handleGetRecommendedUsersToFollow({
  controller,
  request,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetRecommendedUsersToFollowRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetRecommendedUsersToFollowFailedReason>,
    GetRecommendedUsersToFollowSuccess
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

  //////////////////////////////////////////////////
  // Select Unfollowed Popular Users
  //////////////////////////////////////////////////

  const getMostFollowedUsersNotFollowedByTargetUserResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.getMostFollowedUsersNotFollowedByTargetUser(
      { controller, targetUserId: clientUserId, limit: 5 },
    );
  if (getMostFollowedUsersNotFollowedByTargetUserResponse.type === EitherType.failure) {
    return getMostFollowedUsersNotFollowedByTargetUserResponse;
  }
  const { success: pageOfUnrenderableUsers } =
    getMostFollowedUsersNotFollowedByTargetUserResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable Users
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsResponse =
    await assembleRenderableUsersFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers: pageOfUnrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });
  if (constructRenderableUsersFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsResponse;
  }
  const { success: pageOfRenderableUsers } = constructRenderableUsersFromPartsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: pageOfRenderableUsers,
  });
}
