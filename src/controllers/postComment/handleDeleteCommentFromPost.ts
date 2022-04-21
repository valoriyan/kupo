import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { PostCommentController } from "./postCommentController";

export interface DeleteCommentFromPostRequestBody {
  postCommentId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteCommentFromPostSuccess {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteCommentFromPostFailed {}

export async function handleDeleteCommentFromPost({
  controller,
  request,
  requestBody,
}: {
  controller: PostCommentController;
  request: express.Request;
  requestBody: DeleteCommentFromPostRequestBody;
}): Promise<
  SecuredHTTPResponse<DeleteCommentFromPostFailed, DeleteCommentFromPostSuccess>
> {
  const { postCommentId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { postId } =
    await controller.databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      { postCommentId },
    );

  const { authorUserId: postAuthorUserId } =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
      { postId },
    );

  await controller.databaseService.tableNameToServicesMap.postCommentsTableService.deletePostComment(
    {
      postCommentId,
      authorUserId: clientUserId,
    },
  );

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
    {
      notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
      referenceTableId: postCommentId,
      recipientUserId: postAuthorUserId,
    },
  );

  return {
    success: {},
  };
}
