import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost } from "./models";
import { constructRenderablePostFromParts } from "./utilities";

export enum GetPostByIdFailureReasons {
  UnknownCause = "Unknown Cause",
}

export interface FailedToGetPostByIdResponse {
  reason: GetPostByIdFailureReasons;
}

export interface SuccessfullyGotPostByIdResponse {
  post: RenderablePost;
}

export interface GetPostByIdRequestBody {
    postId: string;
}

export async function handleGetPostById({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostByIdRequestBody;
}): Promise<
  SecuredHTTPResponse<FailedToGetPostByIdResponse, SuccessfullyGotPostByIdResponse>
> {
  const {
    postId,
  } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;


  const unrenderablePostWithoutElementsOrHashtags = await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId({postId});

  const post = await constructRenderablePostFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    unrenderablePostWithoutElementsOrHashtags,
    clientUserId,
  });

  return {
      success: {post},
  }

}
