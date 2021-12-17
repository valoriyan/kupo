import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { PostCommentController } from "./postCommentController";

export interface DeleteCommentFromPostRequestBody {
  postCommentId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyDeletedCommentFromPostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToDeleteCommentFromPostResponse {}

export async function handleDeleteCommentFromPost({
  controller,
  request,
  requestBody,
}: {
  controller: PostCommentController;
  request: express.Request;
  requestBody: DeleteCommentFromPostRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToDeleteCommentFromPostResponse,
    SuccessfullyDeletedCommentFromPostResponse
  >
> {
  const { postCommentId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.postCommentsTableService.deletePostComment(
    {
      postCommentId,
      authorUserId: clientUserId,
    },
  );

  return {
    success: {},
  };
}
