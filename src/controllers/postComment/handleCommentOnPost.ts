import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PostCommentController } from "./postCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentFromParts } from "./utilities";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";

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

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
    {
      userNotificationId: uuidv4(),
      recipientUserId: renderablePostComment.authorUserId,
      notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
      referenceTableId: postCommentId,
    },
  );

  return {
    success: { postComment: renderablePostComment },
  };
}
