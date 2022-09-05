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
  const now = Date.now();
  const transactionId = uuidv4();

  const { publishedItemId, localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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
  const { success: unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID } =
    selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    const getShopItemByPublishedItemIdResponse =
      await controller.databaseService.tableNameToServicesMap.shopItemsTableService.getShopItemByPublishedItemId(
        { controller, publishedItemId },
      );
    if (getShopItemByPublishedItemIdResponse.type === EitherType.failure) {
      return getShopItemByPublishedItemIdResponse;
    }
    const { success: unrenderableShopItemPreview } = getShopItemByPublishedItemIdResponse;

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

    return {
      type: EitherType.success,
      success: {},
    };
  }

  return Failure({
    controller,
    httpStatusCode: 404,
    reason: PurchaseShopItemFailedReason.UNKNOWN_REASON,
    error: "User not found at handlePurchaseShopItem",
    additionalErrorInformation: "User not found at handlePurchaseShopItem",
  });
}
