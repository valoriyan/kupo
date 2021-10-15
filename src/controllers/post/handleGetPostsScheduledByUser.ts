import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { PostController } from "./postController";

export interface GetPostsScheduledByUserParams {
  // 0 based value
  month: number;
  year: number;
  userTimeZone: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulGetPostsScheduledByUserResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPostsScheduledByUserResponse {}

export async function handleGetPostsScheduledByUser({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsScheduledByUserParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPostsScheduledByUserResponse,
    SuccessfulGetPostsScheduledByUserResponse
  >
> {
    console.log("controller", controller);
    console.log("request", request);
    console.log("requestBody", requestBody);  

  return {};
}
