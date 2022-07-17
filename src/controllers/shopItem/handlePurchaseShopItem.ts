import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "../publishedItem/shopItem/shopItemController";

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
      await controller.databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
        {
          controller,
          publishedItemId,
        },
      );
    if (getShopItemByPublishedItemIdResponse.type === EitherType.failure) {
      return getShopItemByPublishedItemIdResponse;
    }
    const { success: unrenderableShopItemPreview } = getShopItemByPublishedItemIdResponse;

    const getStoredCreditCardByLocalIdResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getStoredCreditCardByLocalId(
        { controller, localCreditCardId },
      );
    if (getStoredCreditCardByLocalIdResponse.type === EitherType.failure) {
      return getStoredCreditCardByLocalIdResponse;
    }
    const { success: dbStoredCreditCardDatum } = getStoredCreditCardByLocalIdResponse;

    const chargeAmountMajorCurrencyUnits = unrenderableShopItemPreview.price;
    const chargeAmountMinorCurrencyUnits = parseInt(chargeAmountMajorCurrencyUnits) * 100;

    const chargeCustomerWithCachedCreditCardResponse =
      await controller.paymentProcessingService.chargeCustomerWithCachedCreditCard({
        controller,
        paymentProcessingCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
        paymentProcessingCreditCardId: dbStoredCreditCardDatum.payment_processor_card_id,
        chargeAmount: chargeAmountMinorCurrencyUnits,
      });

    if (chargeCustomerWithCachedCreditCardResponse.type === EitherType.failure) {
      return chargeCustomerWithCachedCreditCardResponse;
    }

    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: PurchaseShopItemFailedReason.UNKNOWN_REASON,
    error,
    additionalErrorInformation: "Error at handlePurchaseShopItem",
  });
}
