import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts, getClientUserDetails } from "./utilities";

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
  const { clientUserId, errorResponse } = await checkAuthorization(controller, request);
  if (errorResponse) return errorResponse;

  const selectUsersByUserIdsResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { controller, userIds: [clientUserId] },
    );
  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUserIdsResponse;
  const unrenderableUser = unrenderableUsers[0];

  if (!unrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetClientUserProfileFailedReason.NotFound,
      error: "User not found at handleGetClientUserProfile",
      additionalErrorInformation: "User not found at handleGetClientUserProfile",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const renderableUser = constructRenderableUserFromPartsResponse.success;

  const clientUserDetailsResponse = await getClientUserDetails({
    controller,
    databaseService: controller.databaseService,
    userId: renderableUser.userId,
  });
  if (clientUserDetailsResponse.type === EitherType.failure) {
    return clientUserDetailsResponse;
  }
  const clientUserDetails = clientUserDetailsResponse.success;

  return Success({
    ...renderableUser,
    ...clientUserDetails,
  });
}
