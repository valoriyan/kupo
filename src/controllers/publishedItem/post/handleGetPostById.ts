import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost } from "./models";
import { constructRenderablePostFromParts } from "./utilities";

export enum GetPostByIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPostByIdFailed {
  reason: GetPostByIdFailedReason;
}

export interface GetPostByIdSuccess {
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
}): Promise<SecuredHTTPResponse<GetPostByIdFailed, GetPostByIdSuccess>> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderablePostWithoutElementsOrHashtags =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: postId },
    );

  const post = await constructRenderablePostFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItem: unrenderablePostWithoutElementsOrHashtags,
    clientUserId,
  });

  return {
    success: { post },
  };
}