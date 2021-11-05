import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
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
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { postId } = requestBody;

  await controller.databaseService.tableNameToServicesMap.postsTableService.deletePost({
    postId,
  });
  await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.deletePostContentElementsByPostId(
    { postId },
  );

  return {};
}
