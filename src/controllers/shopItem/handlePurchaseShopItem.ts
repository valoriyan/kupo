import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
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
}): Promise<SecuredHTTPResponse<PurchaseShopItemFailedReason, PurchaseShopItemSuccess>> {
  const { publishedItemId, localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { userId: clientUserId },
    );

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    const unrenderableShopItemPreview =
      await controller.databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
        { publishedItemId },
      );

    const dbStoredCreditCardDatum =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getStoredCreditCardByLocalId(
        { localCreditCardId },
      );

    console.log("unrenderableShopItemPreview", unrenderableShopItemPreview);

    const chargeAmountMajorCurrencyUnits = unrenderableShopItemPreview.price;
    const chargeAmountMinorCurrencyUnits = parseInt(chargeAmountMajorCurrencyUnits) * 100;

    await controller.paymentProcessingService.chargeCustomerWithCachedCreditCard({
      paymentProcessingCustomerId:
        unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
      paymentProcessingCreditCardId: dbStoredCreditCardDatum.payment_processor_card_id,
      chargeAmount: chargeAmountMinorCurrencyUnits,
    });

    return {
      success: {},
    };
  }

  return {
    error: {
      reason: PurchaseShopItemFailedReason.UNKNOWN_REASON,
    },
  };
}
