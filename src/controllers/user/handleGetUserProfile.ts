import express from "express";
import { DBUser } from "src/services/databaseService/tableServices/usersTableService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/authUtilities";
import { ProfilePrivacySetting } from "./models";
import { UserPageController } from "./userPageController";

export interface GetUserProfileParams {
  username?: string;
}
export interface SuccessfulGetUserProfileResponse {
  id: string;
  username: string;
  followers: {
    count: number;
  };
  subscribers: {
    count: number;
  };
  follows: {
    count: number;
  };
  bio?: string;
  website?: string;

  // Is this private to user
  canViewContent: boolean;
}

export enum DeniedGetUserProfileResponseReason {
  Blocked = "Blocked",
  NotFound = "User Not Found",
}

export interface DeniedGetUserProfileResponse {
  reason: DeniedGetUserProfileResponseReason;
}

export async function handleGetUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUserProfileParams;
}): Promise<
  SecuredHTTPResponse<DeniedGetUserProfileResponse, SuccessfulGetUserProfileResponse>
> {
  // TODO: CHECK IF USER HAS ACCESS TO PROFILE
  // IF Private hide posts and shop
  const { userId: clientUserId, error } = await checkAuthorization(controller, request);

  let user: DBUser | undefined;
  if (requestBody.username) {
    // Fetch user profile by given username
    user =
      await controller.databaseService.tableServices.usersTableService.selectUserByUsername(
        {
          username: requestBody.username,
        },
      );
  } else {
    // Fetch user profile by own userId
    if (error) return error;
    user =
      await controller.databaseService.tableServices.usersTableService.selectUserByUserId(
        { userId: clientUserId },
      );
  }

  if (!user) {
    controller.setStatus(404);
    return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
  }

  const canViewContent =
    user.profile_privacy_setting === ProfilePrivacySetting.Public ||
    (await controller.databaseService.tableServices.userFollowsTableService.isUserIdFollowingUserId(
      {
        userIdDoingFollowing: clientUserId,
        userIdBeingFollowed: user.id,
      },
    ));

  const numberOfFollowersOfUserId: number =
    await controller.databaseService.tableServices.userFollowsTableService.countFollowersOfUserId(
      {
        userIdBeingFollowed: user.id,
      },
    );

  const numberOfFollowsByUserId: number =
    await controller.databaseService.tableServices.userFollowsTableService.countFollowsOfUserId(
      {
        userIdDoingFollowing: user.id,
      },
    );

  return {
    success: {
      canViewContent,
      id: user.id,
      username: user.username,
      followers: {
        count: numberOfFollowersOfUserId,
      },
      subscribers: {
        // TODO: Figure out what this is
        count: 0,
      },
      follows: {
        count: numberOfFollowsByUserId,
      },
      bio: user.short_bio,
      website: user.user_website,
    },
  };
}
