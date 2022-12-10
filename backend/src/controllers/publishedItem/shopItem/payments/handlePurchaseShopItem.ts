import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../../../utilities/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";
import { v4 as uuidv4 } from "uuid";
import { assembleRecordAndSendShopItemSoldNotification } from "../../../../controllers/notification/notificationSenders/assembleRecordAndSendShopItemSoldNotification";
import { constructRenderableShopItemFromPartsById } from "../utilities";

export interface PurchaseShopItemRequestBody {
  publishedItemId: string;
  localCreditCardId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PurchaseShopItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum PurchaseShopItemFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handlePurchaseShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: PurchaseShopItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | PurchaseShopItemFailedReason>,
    PurchaseShopItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const now = Date.now();
  const transactionId = uuidv4();

  const { publishedItemId, localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get user with purchasing info
  //////////////////////////////////////////////////

  const selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { controller, userId: clientUserId },
    );

  if (
    selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse.type ===
    EitherType.failure
  ) {
    return selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;
  }
  const { success: maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID } =
    selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;

  if (!maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: PurchaseShopItemFailedReason.UNKNOWN_REASON,
      error: "User not found at handlePurchaseShopItem",
      additionalErrorInformation: "User not found at handlePurchaseShopItem",
    });
  }

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID;

  const getShopItemByPublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.shopItemsTableService.getShopItemByPublishedItemId(
      { controller, publishedItemId },
    );
  if (getShopItemByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemByPublishedItemIdResponse;
  }
  const { success: unrenderableShopItemPreview } = getShopItemByPublishedItemIdResponse;

  //////////////////////////////////////////////////
  // Charge User
  //////////////////////////////////////////////////

  const getStoredCreditCardByLocalIdResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getStoredCreditCardByLocalId(
      {
        controller,
        localCreditCardId,
      },
    );
  if (getStoredCreditCardByLocalIdResponse.type === EitherType.failure) {
    return getStoredCreditCardByLocalIdResponse;
  }
  const { success: storedCreditCard } = getStoredCreditCardByLocalIdResponse;

  const chargeAmountMajorCurrencyUnits = parseInt(unrenderableShopItemPreview.price); // i.e. charge amount in US Dollars
  const chargeAmountMinorCurrencyUnits = chargeAmountMajorCurrencyUnits * 100; // i.e. charge amount in US Cents

  const chargeCustomerWithCachedCreditCardResponse =
    await controller.paymentProcessingService.chargeCustomerWithCachedCreditCard({
      controller,
      paymentProcessingCustomerId:
        unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
      paymentProcessingCreditCardId: storedCreditCard.payment_processor_card_id,
      chargeAmount: chargeAmountMinorCurrencyUnits,
    });
  if (chargeCustomerWithCachedCreditCardResponse.type === EitherType.failure) {
    return chargeCustomerWithCachedCreditCardResponse;
  }

  //////////////////////////////////////////////////
  // Record user transaction
  //////////////////////////////////////////////////

  const recordTransactionResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.recordTransaction(
      {
        controller,
        transactionId,
        publishedItemId,
        nonCreatorUserId: clientUserId,
        creationTimestamp: now,
      },
    );

  if (recordTransactionResponse.type === EitherType.failure) {
    return recordTransactionResponse;
  }

  //////////////////////////////////////////////////
  // Get the Shop Item
  //////////////////////////////////////////////////

  const constructRenderableShopItemFromPartsByIdResponse =
    await constructRenderableShopItemFromPartsById({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      publishedItemId,
      requestorUserId: clientUserId,
    });
  if (constructRenderableShopItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderableShopItemFromPartsByIdResponse;
  }

  const { success: renderableShopItem } =
    constructRenderableShopItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Send notification to seller
  //////////////////////////////////////////////////

  const assembleRecordAndSendShopItemSoldNotificationResponse =
    await assembleRecordAndSendShopItemSoldNotification({
      controller,
      renderableShopItem,
      recipientUserId: renderableShopItem.authorUserId,
      publishedItemTransactionId: transactionId,
      databaseService: controller.databaseService,
      blobStorageService: controller.blobStorageService,
      webSocketService: controller.webSocketService,
    });

  if (assembleRecordAndSendShopItemSoldNotificationResponse.type === EitherType.failure) {
    return assembleRecordAndSendShopItemSoldNotificationResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
