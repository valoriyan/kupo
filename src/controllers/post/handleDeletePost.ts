import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToDeletePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulPostDeletionResponse {}

interface HandlerRequestBody {
  postId: string;
}

export async function handleDeletePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<FailedToDeletePostResponse, SuccessfulPostDeletionResponse>
> {
  console.log("controller", controller);
  console.log("request", request);
  console.log("requestBody", requestBody);

  return {};
}
