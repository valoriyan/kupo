import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface RemoveUserLikeFromPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyRemovedUserLikeFromPostResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToRemoveUserLikeFromPostResponse {}

export async function handleRemoveUserLikeFromPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: RemoveUserLikeFromPostRequestBody;
}): Promise<
  HTTPResponse<
    FailedToRemoveUserLikeFromPostResponse,
    SuccessfullyRemovedUserLikeFromPostResponse
  >
> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.postLikesTableService.removePostLikeByUserId(
    {
      postId,
      userId: clientUserId,
    },
  );

  return {};
}
