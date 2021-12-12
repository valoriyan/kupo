import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PostCommentController } from "./postCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentFromParts } from "./utilities";

export interface CommentOnPostRequestBody {
  postId: string;
  text: string;
}

export interface SuccessfullyCommentedOnPostResponse {
  postComment: RenderablePostComment;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToCommentOnPostResponse {}

export async function handleCommentOnPost({
  controller,
  request,
  requestBody,
}: {
  controller: PostCommentController;
  request: express.Request;
  requestBody: CommentOnPostRequestBody;
}): Promise<
  SecuredHTTPResponse<FailedToCommentOnPostResponse, SuccessfullyCommentedOnPostResponse>
> {
  const { postId, text } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const postCommentId: string = uuidv4();

  const creationTimestamp = Date.now();

  await controller.databaseService.tableNameToServicesMap.postCommentsTableService.createPostComment(
    {
      postCommentId,
      postId,
      text,
      authorUserId: clientUserId,
      creationTimestamp,
    },
  );

  const renderablePostComment = await constructRenderablePostCommentFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    unrenderablePostComment: {
      postCommentId,
      postId,
      text,
      authorUserId: clientUserId,
      creationTimestamp,
    },
    clientUserId,
  });

  return {
    success: { postComment: renderablePostComment },
  };
}
