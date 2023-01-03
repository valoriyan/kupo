/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";
import { assembleRenderablePublishedItemCommentById } from "../../publishedItem/publishedItemComment/utilities";
import { v4 as uuidv4 } from "uuid";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageService } from "../../../services/blobStorageService";
import { assemblePublishedItemById } from "../../publishedItem/utilities/assemblePublishedItems";

export async function assembleRecordAndSendNewTagInPublishedItemCommentNotification({
  controller,
  publishedItemId,
  publishedItemCommentId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishedItemId: string;
  publishedItemCommentId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Assemble Renderable Published Item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsByIdResponse = await assemblePublishedItemById({
    controller,
    requestorUserId: recipientUserId,
    publishedItemId,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable Published Item Comment
  //////////////////////////////////////////////////

  const assembleRenderablePublishedItemCommentByIdResponse =
    await assembleRenderablePublishedItemCommentById({
      controller,
      clientUserId: recipientUserId,
      publishedItemCommentId: publishedItemCommentId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (assembleRenderablePublishedItemCommentByIdResponse.type === EitherType.failure) {
    return assembleRenderablePublishedItemCommentByIdResponse;
  }
  const { success: publishedItemComment } =
    assembleRenderablePublishedItemCommentByIdResponse;

  //////////////////////////////////////////////////
  // Assemble Renderable User That Authored Comment
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: recipientUserId,
      userId: publishedItemComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Write Notification to DB
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
          publishedItemCommentId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
  //////////////////////////////////////////////////
  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: recipientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Notification
  //////////////////////////////////////////////////

  const renderableNewTagInPublishedItemCommentNotification: RenderableNewTagInPublishedItemCommentNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
      eventTimestamp: Date.now(),
      userTaggingClient,
      publishedItem,
      publishedItemComment,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: renderableNewTagInPublishedItemCommentNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
