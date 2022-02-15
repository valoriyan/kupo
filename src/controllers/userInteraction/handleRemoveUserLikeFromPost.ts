import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
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


  const deletedPostLike = await controller.databaseService.tableNameToServicesMap.postLikesTableService.removePostLikeByUserId(
    {
      postId,
      userId: clientUserId,
    },
  );

  const unrenderablePost = await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId({postId});

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotification(
    {
      recipientUserId: unrenderablePost.authorUserId,
      notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
      referenceTableId: deletedPostLike.post_like_id,
    },
  );


  return {};
}
