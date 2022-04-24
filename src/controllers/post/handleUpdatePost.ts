import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePostFailed {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdatePostSuccess {}

export interface UpdatePostRequestBody {
  postId: string;

  caption?: string;

  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
}

export async function handleUpdatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: UpdatePostRequestBody;
}): Promise<SecuredHTTPResponse<UpdatePostFailed, UpdatePostSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { postId, caption, scheduledPublicationTimestamp, expirationTimestamp } =
    requestBody;

  await controller.databaseService.tableNameToServicesMap.postsTableService.updatePost({
    postId,
    authorUserId: clientUserId,
    caption: caption ? caption.toLowerCase() : caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  });

  return {};
}
