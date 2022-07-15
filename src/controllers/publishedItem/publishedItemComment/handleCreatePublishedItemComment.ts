import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../types/monads";
import { checkAuthorization } from "../../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePostComment } from "./models";
import { constructRenderablePostCommentFromParts } from "./utilities";
import { DatabaseService } from "../../../services/databaseService";
import { collectTagsFromText } from "../../utilities/collectTagsFromText";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { WebSocketService } from "../../../services/webSocketService";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRecordAndSendNewTagInPublishedItemCommentNotification } from "../../notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCommentNotification";

export interface CreatePublishedItemCommentRequestBody {
  postId: string;
  text: string;
}

export interface CreatePublishedItemCommentSuccess {
  postComment: RenderablePostComment;
}

export enum CreatePublishedItemCommentFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleCreatePublishedItemComment({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemCommentController;
  request: express.Request;
  requestBody: CreatePublishedItemCommentRequestBody;
}): Promise<
  SecuredHTTPResponse<
    CreatePublishedItemCommentFailedReason,
    CreatePublishedItemCommentSuccess
  >
> {
  const { postId, text } = requestBody;

  const { clientUserId, errorResponse } = await checkAuthorization(controller, request);
  if (errorResponse) return errorResponse;

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
    type: EitherType.success,
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
    await assembleRecordAndSendNewTagInPublishedItemCommentNotification({
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
