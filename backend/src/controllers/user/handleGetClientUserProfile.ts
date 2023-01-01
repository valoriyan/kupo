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
import { assembleRenderableUserById } from "./utilities/assembleRenderableUserById";

export interface ClientUserDetails {
  followingCommunities: { count: number };
  followerRequests: { count: number };
}

export type GetClientUserProfileSuccess = RenderableUser & ClientUserDetails;

export enum GetClientUserProfileFailedReason {
  NotFound = "User Not Found",
}

export async function handleGetClientUserProfile({
  controller,
  request,
}: {
  controller: UserPageController;
  request: express.Request;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetClientUserProfileFailedReason>,
    GetClientUserProfileSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse } = await checkAuthentication(controller, request);
  if (errorResponse) return errorResponse;

  //////////////////////////////////////////////////
  // Get Renderable User
  //////////////////////////////////////////////////

  const assembleRenderableUserByIdResponse = await assembleRenderableUserById({
    controller,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    requestorUserId: clientUserId,
    userId: clientUserId,
  });
  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: renderableUser } = assembleRenderableUserByIdResponse;

  //////////////////////////////////////////////////
  // Read Count of Publishing Channel Follows of Target UserId from DB
  //////////////////////////////////////////////////

  const countPublishingChannelFollowsOfUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.countPublishingChannelFollowsOfUserId(
      {
        controller,
        userIdDoingFollowing: clientUserId,
        areFollowsPending: false,
      },
    );
  if (countPublishingChannelFollowsOfUserIdResponse.type === EitherType.failure) {
    return countPublishingChannelFollowsOfUserIdResponse;
  }
  const { success: numberOfFollowingCommunities } =
    countPublishingChannelFollowsOfUserIdResponse;

  //////////////////////////////////////////////////
  // Count User Followers of Target User from DB
  //////////////////////////////////////////////////

  const countFollowersOfUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.countFollowersOfUserId(
      {
        controller,
        userIdBeingFollowed: clientUserId,
        areFollowsPending: true,
      },
    );
  if (countFollowersOfUserIdResponse.type === EitherType.failure) {
    return countFollowersOfUserIdResponse;
  }
  const { success: numberOfPendingFollows } = countFollowersOfUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Client User Details
  //////////////////////////////////////////////////

  const clientUserDetails: ClientUserDetails = {
    followingCommunities: { count: numberOfFollowingCommunities },
    followerRequests: { count: numberOfPendingFollows },
  };

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    ...renderableUser,
    ...clientUserDetails,
  });
}
