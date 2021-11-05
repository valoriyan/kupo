import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdatePostResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulPostUpdateResponse {}

interface HandlerRequestBody {
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
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<FailedToUpdatePostResponse, SuccessfulPostUpdateResponse>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { postId, caption, scheduledPublicationTimestamp, expirationTimestamp } =
    requestBody;

  await controller.databaseService.tableNameToServicesMap.postsTableService.updatePost({
    postId,
    authorUserId: clientUserId,
    caption: caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  });

  return {};
}
