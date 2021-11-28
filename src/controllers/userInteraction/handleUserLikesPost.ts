import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface UserLikesPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulUserLikesPostResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToLikePostByUserResponse {}

export async function handleUserLikesPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UserLikesPostRequestBody;
}): Promise<
  HTTPResponse<FailedToLikePostByUserResponse, SuccessfulUserLikesPostResponse>
> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.postLikesTableService.createPostLikeFromUserId(
    {
      postId,
      userId: clientUserId,
      timestamp: Date.now(),
    },
  );

  return {};
}
