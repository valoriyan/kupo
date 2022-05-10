import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PostCommentController } from "./postCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentFromParts } from "./utilities";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../user/utilities";
import { constructRenderablePostFromParts } from "../post/utilities";

export interface CommentOnPostRequestBody {
  postId: string;
  text: string;
}

export interface CommentOnPostSuccess {
  postComment: RenderablePostComment;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommentOnPostFailed {}

export async function handleCommentOnPost({
  controller,
  request,
  requestBody,
}: {
  controller: PostCommentController;
  request: express.Request;
  requestBody: CommentOnPostRequestBody;
}): Promise<SecuredHTTPResponse<CommentOnPostFailed, CommentOnPostSuccess>> {
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

  const { authorUserId: recipientUserId } =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
      { postId },
    );

  if (recipientUserId !== clientUserId) {
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        userNotificationId: uuidv4(),
        recipientUserId,
        notificationType: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
        referenceTableId: postCommentId,
      },
    );

    const unrenderableClientUser = await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: clientUserId,
    });

    if (!!unrenderableClientUser) {
      const clientUser = await constructRenderableUserFromParts({
        clientUserId,
        unrenderableUser: unrenderableClientUser,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
      });    

      const unrenderablePostWithoutElementsOrHashtags =
      await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
        { postId },
      );
  
      const post = await constructRenderablePostFromParts({
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        unrenderablePostWithoutElementsOrHashtags,
        clientUserId,    
      });
  
      const renderableNewCommentOnPostNotification = {
        type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
        eventTimestamp: Date.now(),
        userThatCommented: clientUser,
        post,
        postComment: renderablePostComment,    
      }
  
      await controller.webSocketService.notifyUserIdOfNewCommentOnPost({
        userId: recipientUserId,
        renderableNewCommentOnPostNotification,
      });  


    }
  


  

  }


  return {
    success: { postComment: renderablePostComment },
  };
}
