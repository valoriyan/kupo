import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { UserProfileSearchResponseItem } from "./models";
import { UserPageController } from "./userPageController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchUserProfilesByUsernameParams {
  searchString: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulSearchUserProfilesByUsernameResponse {
  results: UserProfileSearchResponseItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToSearchUserProfilesByUsernameResponse {}

export async function handleSearchUserProfilesByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SearchUserProfilesByUsernameParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToSearchUserProfilesByUsernameResponse,
    SuccessfulSearchUserProfilesByUsernameResponse
  >
> {
  console.log("controller", controller);
  console.log("request", request);
  console.log("requestBody", requestBody);

  return {};
}
