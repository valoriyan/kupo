import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableShopItemSoldNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { constructRenderableShopItemFromPartsById } from "../../../controllers/publishedItem/shopItem/utilities";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";

export async function assembleRenderableShopItemSoldNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItemSoldNotification>
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    published_item_transaction_reference: published_item_transaction_id,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Get the Published Item Transaction
  //////////////////////////////////////////////////

  const maybeGetPublishedItemTransactionByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.maybeGetPublishedItemTransactionById(
      {
        controller,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        publishedItemTransactionId: published_item_transaction_id!,
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
      error: "Published item transaction not found",
      additionalErrorInformation: "Error at assembleRenderableShopItemSoldNotification",
    });
  }
  const publishedItemTransaction = maybePublishedItemTransaction;

  //////////////////////////////////////////////////
  // Assemble the Renderable Shop Item
  //////////////////////////////////////////////////

  const constructRenderableShopItemFromPartsByIdResponse =
    await constructRenderableShopItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId: publishedItemTransaction.published_item_id,
      requestorUserId: clientUserId,
    });
  if (constructRenderableShopItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderableShopItemFromPartsByIdResponse;
  }

  const { success: renderableShopItem } =
    constructRenderableShopItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable Purchasing User
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: clientUserId,
      userId: publishedItemTransaction.non_creator_user_id,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: renderableUserPurchasingShopItem } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );

  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    eventTimestamp: parseInt(publishedItemTransaction.creation_timestamp),
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.SHOP_ITEM_SOLD,
    countOfUnreadNotifications,
    purchaser: renderableUserPurchasingShopItem,
    shopItem: renderableShopItem,
  });
}
