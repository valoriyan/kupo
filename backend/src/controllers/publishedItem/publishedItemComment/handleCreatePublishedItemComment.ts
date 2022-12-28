/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { checkAuthentication } from "../../auth/utilities";
import { v4 as uuidv4 } from "uuid";
import { PublishedItemCommentController } from "./publishedItemCommentController";
import { RenderablePublishedItemComment } from "./models";
import { assembleRenderablePublishedItemCommentFromCachedComponents } from "./utilities";
import { DatabaseService } from "../../../services/databaseService";
import { collectTagsFromText } from "../../utilities/collectTagsFromText";
import { BlobStorageService } from "../../../services/blobStorageService";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { publishedItemId, text } = requestBody;

  const { clientUserId, errorResponse } = await checkAuthentication(controller, request);
  if (errorResponse) return errorResponse;

  const postCommentId: string = uuidv4();

  const now = Date.now();

  //////////////////////////////////////////////////
  // Write Published Item Comment to DB
  //////////////////////////////////////////////////

  const createPublishedItemCommentResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemCommentsTableService.createPublishedItemComment(
      {
        controller,
        publishedItemCommentId: postCommentId,
        publishedItemId: publishedItemId,
        text,
        authorUserId: clientUserId,
        creationTimestamp: now,
      },
    );
  if (createPublishedItemCommentResponse.type === EitherType.failure) {
    return createPublishedItemCommentResponse;
  }

  //////////////////////////////////////////////////
  // Compile renderable comment
  //////////////////////////////////////////////////

  const constructRenderablePublishedItemCommentFromPartsResponse =
    await assembleRenderablePublishedItemCommentFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishedItemComment: {
        publishedItemCommentId: postCommentId,
        publishedItemId: publishedItemId,
        text,
        authorUserId: clientUserId,
        creationTimestamp: now,
      },
      clientUserId,
    });
  if (
    constructRenderablePublishedItemCommentFromPartsResponse.type === EitherType.failure
  ) {
    return constructRenderablePublishedItemCommentFromPartsResponse;
  }
  const { success: renderablePostComment } =
    constructRenderablePublishedItemCommentFromPartsResponse;

  //////////////////////////////////////////////////
  // Get user owning the post hosting the comment
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Send out relevant notifications
  //////////////////////////////////////////////////

  const considerAndExecuteNotificationsResponse = await considerAndExecuteNotifications({
    controller,
    renderablePublishedItemComment: renderablePostComment,
    authorOfPublishedItemUserId: authorOfPublishedItemUserId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });
  if (considerAndExecuteNotificationsResponse.type === EitherType.failure) {
    return considerAndExecuteNotificationsResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ postComment: renderablePostComment });
}

async function considerAndExecuteNotifications({
  controller,
  renderablePublishedItemComment,
  authorOfPublishedItemUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderablePublishedItemComment: RenderablePublishedItemComment;
  authorOfPublishedItemUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const authorOfCommentUserId = renderablePublishedItemComment.authorUserId;

  //////////////////////////////////////////////////
  // Get usernames tagged in comment
  //////////////////////////////////////////////////

  const tags = collectTagsFromText({ text: renderablePublishedItemComment.text });

  //////////////////////////////////////////////////
  // Get user ids associated with tagged usernames
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Send a new comment notification to the author of the post
  // If both:
  //      - the author of the comment is not the author of the post
  //      - and the tags do not include the author of the post
  //////////////////////////////////////////////////

  if (
    !(authorOfPublishedItemUserId === authorOfCommentUserId) &&
    !foundUserIdsMatchingTags.includes(authorOfPublishedItemUserId)
  ) {
    await assembleRecordAndSendNewCommentOnPublishedItemNotification({
      controller,
      publishedItemId: renderablePublishedItemComment.publishedItemId,
      publishedItemCommentId: renderablePublishedItemComment.publishedItemCommentId,
      recipientUserId: authorOfPublishedItemUserId,
      databaseService,
      blobStorageService,
      webSocketService,
    });
  }

  //////////////////////////////////////////////////
  // Send tagged comment notifications to everyone tagged
  //////////////////////////////////////////////////
  const assembleRecordAndSendNewTagInPublishedItemCommentNotificationResponses =
    await BluebirdPromise.map(
      foundUserIdsMatchingTags,
      async (taggedUserId) =>
        await assembleRecordAndSendNewTagInPublishedItemCommentNotification({
          controller,
          publishedItemId: renderablePublishedItemComment.publishedItemId,
          publishedItemCommentId: renderablePublishedItemComment.publishedItemCommentId,
          recipientUserId: taggedUserId,
          databaseService,
          blobStorageService,
          webSocketService,
        }),
    );

  const mappedResponse = unwrapListOfEitherResponses({
    eitherResponses:
      assembleRecordAndSendNewTagInPublishedItemCommentNotificationResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
