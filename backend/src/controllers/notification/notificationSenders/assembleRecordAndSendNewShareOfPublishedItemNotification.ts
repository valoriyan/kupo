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
import { RenderableNewShareOfPublishedItemNotification } from "../models/renderableUserNotifications";
import { BlobStorageService } from "../../../services/blobStorageService";
import { assembleRenderableUserById } from "../../../controllers/user/utilities/assembleRenderableUserById";
import { assemblePublishedItemById } from "../../../controllers/publishedItem/utilities/assemblePublishedItems";

export async function assembleRecordAndSendNewShareOfPublishedItemNotification({
  controller,
  sourcePublishedItemId,
  newPublishedItemId,
  userIdSharingPublishedItem,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  sourcePublishedItemId: string;
  newPublishedItemId: string;
  userIdSharingPublishedItem: string;
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
    userId: userIdSharingPublishedItem,
    blobStorageService,
    databaseService,
  });

  if (assembleRenderableUserByIdResponse.type === EitherType.failure) {
    return assembleRenderableUserByIdResponse;
  }
  const { success: userSharingPublishedItem } = assembleRenderableUserByIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Shared Published Item
  //////////////////////////////////////////////////

  const assemblePublishedItemByIdResponse = await assemblePublishedItemById({
    controller,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
    publishedItemId: sourcePublishedItemId,
    requestorUserId: recipientUserId,
  });
  if (assemblePublishedItemByIdResponse.type === EitherType.failure) {
    return assemblePublishedItemByIdResponse;
  }
  const { success: sourcePublishedItem } = assemblePublishedItemByIdResponse;

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
          type: NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM,
          publishedItemId: newPublishedItemId,
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

  const renderableNewShareOfPublishedItemNotification: RenderableNewShareOfPublishedItemNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM,
      eventTimestamp: Date.now(),
      userSharingPublishedItem,
      sourcePublishedItem,
      newPublishedItemId,
    };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfUserNotification(
    {
      userId: recipientUserId,
      notification: renderableNewShareOfPublishedItemNotification,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
