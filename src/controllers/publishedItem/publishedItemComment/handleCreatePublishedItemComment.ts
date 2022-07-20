/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePublishedItemComment } from "./models";
import { constructRenderablePublishedItemCommentFromParts } from "./utilities";
import { DatabaseService } from "../../../services/databaseService";
import { collectTagsFromText } from "../../utilities/collectTagsFromText";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { WebSocketService } from "../../../services/webSocketService";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRecordAndSendNewTagInPublishedItemCommentNotification } from "../../notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCommentNotification";
import { Controller } from "tsoa";
import { assembleRecordAndSendNewCommentOnPublishedItemNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewCommentOnPublishedItemNotification";

export interface CreatePublishedItemCommentRequestBody {
  publishedItemId: string;
  text: string;
}

export interface CreatePublishedItemCommentSuccess {
  postComment: RenderablePublishedItemComment;
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
    ErrorReasonTypes<string | CreatePublishedItemCommentFailedReason>,
    CreatePublishedItemCommentSuccess
  >
> {
  const { publishedItemId, text } = requestBody;

  const { clientUserId, errorResponse } = await checkAuthorization(controller, request);
  if (errorResponse) return errorResponse;

  const postCommentId: string = uuidv4();

  const creationTimestamp = Date.now();

  const createPostCommentResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.createPublishedItemComment(
      {
        controller,
        publishedItemCommentId: postCommentId,
        publishedItemId: publishedItemId,
        text,
        authorUserId: clientUserId,
        creationTimestamp,
      },
    );
  if (createPostCommentResponse.type === EitherType.failure) {
    return createPostCommentResponse;
  }

  const constructRenderablePostCommentFromPartsResponse =
    await constructRenderablePublishedItemCommentFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishedItemComment: {
        publishedItemCommentId: postCommentId,
        publishedItemId: publishedItemId,
        text,
        authorUserId: clientUserId,
        creationTimestamp,
      },
      clientUserId,
    });
  if (constructRenderablePostCommentFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsResponse;
  }
  const { success: renderablePostComment } =
    constructRenderablePostCommentFromPartsResponse;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const {
    success: { authorUserId: authorOfPublishedItemUserId },
  } = getPublishedItemByIdResponse;

  const considerAndExecuteNotificationsResponse = await considerAndExecuteNotifications({
    controller,
    renderablePostComment,
    authorOfPublishedItemUserId: authorOfPublishedItemUserId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });
  if (considerAndExecuteNotificationsResponse.type === EitherType.failure) {
    return considerAndExecuteNotificationsResponse;
  }

  return Success({ postComment: renderablePostComment });
}

async function considerAndExecuteNotifications({
  controller,
  renderablePostComment,
  authorOfPublishedItemUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderablePostComment: RenderablePublishedItemComment;
  authorOfPublishedItemUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  const authorOfCommentUserId = renderablePostComment.authorUserId;

  const tags = collectTagsFromText({ text: renderablePostComment.text });

  const selectUsersByUsernamesResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: tags },
    );
  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: foundUnrenderableUsersMatchingTags } = selectUsersByUsernamesResponse;

  const foundUserIdsMatchingTags = foundUnrenderableUsersMatchingTags
    .map(({ userId }) => userId)
    .filter((userId) => userId !== authorOfCommentUserId);

  // IF THE AUTHOR WAS NOT TAGGED, THEN SEND NEW COMMENT MESSAGE
  if (
    !(authorOfPublishedItemUserId === authorOfCommentUserId) &&
    !foundUserIdsMatchingTags.includes(authorOfPublishedItemUserId)
  ) {
    await assembleRecordAndSendNewCommentOnPublishedItemNotification({
      controller,
      publishedItemId: renderablePostComment.publishedItemId,
      publishedItemCommentId: renderablePostComment.publishedItemCommentId,
      recipientUserId: authorOfPublishedItemUserId,
      databaseService,
      blobStorageService,
      webSocketService,
    });
  }
  const assembleRecordAndSendNewTagInPublishedItemCommentNotificationResponses =
    await BluebirdPromise.map(
      foundUserIdsMatchingTags,
      async (taggedUserId) =>
        await assembleRecordAndSendNewTagInPublishedItemCommentNotification({
          controller,
          publishedItemId: renderablePostComment.publishedItemId,
          publishedItemCommentId: renderablePostComment.publishedItemCommentId,
          recipientUserId: taggedUserId,
          databaseService,
          blobStorageService,
          webSocketService,
        }),
    );

  const mappedResponse = collectMappedResponses({
    mappedResponses:
      assembleRecordAndSendNewTagInPublishedItemCommentNotificationResponses,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  return Success({});
}
