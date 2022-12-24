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
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { RenderableShopItemSoldNotification } from "../models/renderableUserNotifications";
import { RenderableShopItem } from "../../../controllers/publishedItem/shopItem/models";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function assembleRecordAndSendShopItemSoldNotification({
  controller,
  renderableShopItem,
  recipientUserId,
  publishedItemTransactionId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderableShopItem: RenderableShopItem;
  recipientUserId: string;
  publishedItemTransactionId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // GET THE USER TO BE NOTIFIED
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId: recipientUserId,
      userId: recipientUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: renderableUserPurchasingShopItem } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD,
          publishedItemTransactionId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // GET COUNT OF UNREAD NOTIFICATIONS
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
  // COMPILE AND SEND NOTIFICATION TO CLIENT
  //////////////////////////////////////////////////

  const renderableShopItemSoldNotification: RenderableShopItemSoldNotification = {
    eventTimestamp: Date.now(),
    type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD,
    countOfUnreadNotifications,
    purchaser: renderableUserPurchasingShopItem,
    shopItem: renderableShopItem,
  };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfShopItemSold({
    userId: recipientUserId,
    renderableShopItemSoldNotification,
  });

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({});
}
