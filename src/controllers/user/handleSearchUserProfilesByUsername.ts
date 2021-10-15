import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { UserPageController } from "./userPageController";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchUserProfilesByUsernameParams {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulSearchUserProfilesByUsernameResponse {
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
  SecuredHTTPResponse<FailedToSearchUserProfilesByUsernameResponse, SearchUserProfilesByUsernameParams>
> {
    console.log("controller", controller);
    console.log("request", request);
    console.log("requestBody", requestBody);

    return {};
}
