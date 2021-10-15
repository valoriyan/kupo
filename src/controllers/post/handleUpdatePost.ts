import express from "express";
import { HTTPResponse } from "src/types/httpResponse";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulPostUpdateResponse {}

interface HandlerRequestBody {
  mediaFiles?: Express.Multer.File[];

  caption?: string;
  hashtags?: string[];
  expirationTimestamp?: number;

  title?: string;
  price?: number;

  scheduledPublicationTimestamp?: number;
}

export async function handleUpdatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<HTTPResponse<FailedToUpdatePostResponse, SuccessfulPostUpdateResponse>> {
  console.log("controller", controller);
  console.log("request", request);
  console.log("requestBody", requestBody);

  return {};
}
