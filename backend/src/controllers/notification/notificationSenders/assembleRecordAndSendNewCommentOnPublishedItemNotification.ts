/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { assemblePublishedItemById } from "../../../controllers/publishedItem/utilities/constructPublishedItemsFromParts";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assembleRenderablePublishedItemCommentById } from "../../publishedItem/publishedItemComment/utilities";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";
import { RenderableNewCommentOnPublishedItemNotification } from "../models/renderableUserNotifications";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function assembleRecordAndSendNewCommentOnPublishedItemNotification({
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
  // Assemble Published Item
  //////////////////////////////////////////////////
  const assemblePublishedItemByIdResponse = await assemblePublishedItemById({
    controller,
    blobStorageService,
    databaseService,
    publishedItemId,
    requestorUserId: recipientUserId,
  });
  if (assemblePublishedItemByIdResponse.type === EitherType.failure) {
    return assemblePublishedItemByIdResponse;
  }
  const { success: publishedItem } = assemblePublishedItemByIdResponse;

  //////////////////////////////////////////////////
  // Assemble Comment
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
  const { success: postComment } = assembleRenderablePublishedItemCommentByIdResponse;

  //////////////////////////////////////////////////
  // Assemble User That Authored Comment
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: recipientUserId,
      userId: postComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userThatCommented } = constructRenderableUserFromPartsByUserIdResponse;

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
          type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
          publishedItemCommentId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // Get Count of Unread Notificiations
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: publishedItem.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Assemble Notification
  //////////////////////////////////////////////////

  const renderableNewCommentOnPostNotification: RenderableNewCommentOnPublishedItemNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
      eventTimestamp: Date.now(),
      userThatCommented,
      publishedItem,
      publishedItemComment: postComment,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewCommentOnPost(
    {
      userId: recipientUserId,
      renderableNewCommentOnPostNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
