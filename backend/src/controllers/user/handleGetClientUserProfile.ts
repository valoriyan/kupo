import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromPartsByUserId } from "./utilities";

export interface ClientUserDetails {
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
  // Inputs
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse } = await checkAuthorization(controller, request);
  if (errorResponse) return errorResponse;

  //////////////////////////////////////////////////
  // Get Renderable User
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      requestorUserId: clientUserId,
      userId: clientUserId,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: renderableUser } = constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Client User Details
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

  const clientUserDetails: ClientUserDetails = {
    followerRequests: { count: numberOfPendingFollows },
  };

  return Success({
    ...renderableUser,
    ...clientUserDetails,
  });
}
