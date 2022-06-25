import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PostCommentController } from "./postCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentFromParts } from "./utilities";
import { DatabaseService } from "../../services/databaseService";
import { collectTagsFromText } from "../utilities/collectTagsFromText";
import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { WebSocketService } from "../../services/webSocketService";
import { assembleRecordAndSendNewCommentOnPostNotification } from "../notification/notificationSenders/assembleRecordAndSendNewCommentOnPostNotification";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRecordAndSendNewTagInPublishedItemCommentNotification } from "../notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCommentNotification";

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

  const { authorUserId: authorOfPublishedItemUserId } =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: postId },
    );

  await considerAndExecuteNotifications({
    renderablePostComment,
    authorOfPublishedItemUserId: authorOfPublishedItemUserId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });

  return {
    success: { postComment: renderablePostComment },
  };
}

async function considerAndExecuteNotifications({
  renderablePostComment,
  authorOfPublishedItemUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  renderablePostComment: RenderablePostComment;
  authorOfPublishedItemUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<void> {
  const authorOfCommentUserId = renderablePostComment.authorUserId;

  const tags = collectTagsFromText({ text: renderablePostComment.text });

  const foundUnrenderableUsersMatchingTags =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { usernames: tags },
    );
  const foundUserIdsMatchingTags = foundUnrenderableUsersMatchingTags
    .map(({ userId }) => userId)
    .filter((userId) => userId !== authorOfCommentUserId);

  // IF THE AUTHOR WAS NOT TAGGED, THEN SEND NEW COMMENT MESSAGE
  if (
    !(authorOfPublishedItemUserId === authorOfCommentUserId) &&
    !foundUserIdsMatchingTags.includes(authorOfPublishedItemUserId)
  ) {
    await assembleRecordAndSendNewCommentOnPostNotification({
      publishedItemId: renderablePostComment.postId,
      publishedItemCommentId: renderablePostComment.postCommentId,
      recipientUserId: authorOfPublishedItemUserId,
      databaseService,
      blobStorageService,
      webSocketService,
    });
  }
  await BluebirdPromise.map(
    foundUserIdsMatchingTags,
    async (taggedUserId) =>
      await assembleRecordAndSendNewTagInPublishedItemCommentNotification({
        publishedItemId: renderablePostComment.postId,
        publishedItemCommentId: renderablePostComment.postCommentId,
        recipientUserId: taggedUserId,
        databaseService,
        blobStorageService,
        webSocketService,
      }),
  );
}
