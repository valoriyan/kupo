import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
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
import { constructRenderableUserFromPartsByUserId } from "../../../controllers/user/utilities";

export async function assembleRenderableShopItemSoldNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItemSoldNotification>
> {
  const {
    published_item_transaction_reference: published_item_transaction_id,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // GET THE PUBLISHED ITEM TRANSACTION
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
  // GET THE SHOP ITEM
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
  // GET THE PURCHASING USER
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
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
  // GET THE COUNT OF UNREAD NOTIFICATIONS
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
  // RETURN
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
