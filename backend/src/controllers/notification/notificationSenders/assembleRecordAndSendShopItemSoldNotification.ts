/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";
import { RenderableShopItemSoldNotification } from "../models/renderableUserNotifications";
import { RenderableShopItem } from "../../../controllers/publishedItem/shopItem/models";
import { BlobStorageService } from "../../../services/blobStorageService";
import { GenericResponseFailedReason } from "../../../controllers/models";

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
  // Get the Published Item Transaction
  //////////////////////////////////////////////////

  const maybeGetPublishedItemTransactionByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.maybeGetPublishedItemTransactionById(
      {
        controller,
        publishedItemTransactionId,
      },
    );
  if (maybeGetPublishedItemTransactionByIdResponse.type === EitherType.failure) {
    return maybeGetPublishedItemTransactionByIdResponse;
  }
  const { success: maybePublishedItemTransaction } =
    maybeGetPublishedItemTransactionByIdResponse;

  if (!maybePublishedItemTransaction) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Published Item Transaction not found at at assembleRecordAndSendShopItemSoldNotification",
      additionalErrorInformation:
        "Published Item Transaction not found at at assembleRecordAndSendShopItemSoldNotification",
    });
  }

  const { non_creator_user_id: purchaserUserId } = maybePublishedItemTransaction;

  //////////////////////////////////////////////////
  // Assemble the Renderable Purchasing User
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: recipientUserId,
      userId: purchaserUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: renderableUserPurchasingShopItem } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Write Notification into DB
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

  const renderableShopItemSoldNotification: RenderableShopItemSoldNotification = {
    eventTimestamp: Date.now(),
    type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD,
    countOfUnreadNotifications,
    purchaser: renderableUserPurchasingShopItem,
    shopItem: renderableShopItem,
  };

  //////////////////////////////////////////////////
  // Send Notification
  //////////////////////////////////////////////////

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfShopItemSold({
    userId: recipientUserId,
    renderableShopItemSoldNotification,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
