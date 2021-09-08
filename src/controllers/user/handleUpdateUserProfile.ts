import express from "express";
import { HTTPResponse } from "src/types/httpResponse";
import { SecuredHTTPRequest } from "src/types/SecuredHTTPRequest";
import { checkAuthorization } from "../auth/authUtilities";
import { UserPageController } from "./userPageController";

export enum DefaultPostPrivacySetting {
  PublicAndGuestCheckout = "PublicAndGuestCheckout",
}

export interface UpdateUserProfileParams {
  username: string;
  bio: string;
  website: string;
  profileVisibility: DefaultPostPrivacySetting;
  bannedUsernames: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdateUserProfileResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulUpdateToUserProfileResponse {}

export async function handleUpdateUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SecuredHTTPRequest<UpdateUserProfileParams>;
}): Promise<
  HTTPResponse<FailedToUpdateUserProfileResponse, SuccessfulUpdateToUserProfileResponse>
> {
  console.log(requestBody);
  const { userId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const user =
    await controller.databaseService.tableServices.usersTableService.selectUserByUserId({
      userId,
    });

  console.log(user);
  return {};
}
