/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { RenderableNewLikeOnPublishedItemNotification } from "../models/renderableUserNotifications";
import { BlobStorageService } from "../../../services/blobStorageService";
import { assembleRenderableUserById } from "../../../controllers/user/utilities/assembleRenderableUserById";
import { RenderablePublishedItem } from "../../../controllers/publishedItem/models";

export async function assembleRecordAndSendNewLikeOnPublishedItemNotification({
  controller,
  publishedItem,
  publishedItemLikeId,
  userIdThatLikedPublishedItem,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishedItem: RenderablePublishedItem;
  publishedItemLikeId: string;
  userIdThatLikedPublishedItem: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Assemble the User That Liked Published Item
  //////////////////////////////////////////////////

  const assembleRenderableUserByIdResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: recipientUserId,
    userId: userIdThatLikedPublishedItem,
    blobStorageService,
    databaseService,
  });

  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: userThatLikedPublishedItem } = assembleRenderableUserByIdResponse;

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
          type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
          publishedItemLikeId,
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

  const renderableNewLikeOnPublishedItemNotification: RenderableNewLikeOnPublishedItemNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
      eventTimestamp: Date.now(),
      userThatLikedPublishedItem,
      publishedItem,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: renderableNewLikeOnPublishedItemNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
