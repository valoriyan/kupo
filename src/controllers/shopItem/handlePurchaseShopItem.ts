import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";

export interface PurchaseShopItemRequestBody {
  shopItemId: string;
  CREDIT_CARD_NUMBER: string;
  CREDIT_CARD_EXPIRATION_MONTH: string;
  CREDIT_CARD_EXPIRATION_YEAR: string;
  CREDIT_CARD_VERIFICATION_CODE: string;
  CREDIT_CARD_OWNER_NAME: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PurchaseShopItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PurchaseShopItemFailed {}

export async function handlePurchaseShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: PurchaseShopItemRequestBody;
}): Promise<SecuredHTTPResponse<PurchaseShopItemFailed, PurchaseShopItemSuccess>> {
  const {
    shopItemId,
    CREDIT_CARD_NUMBER,
    CREDIT_CARD_EXPIRATION_MONTH,
    CREDIT_CARD_EXPIRATION_YEAR,
    CREDIT_CARD_VERIFICATION_CODE,
    CREDIT_CARD_OWNER_NAME,
  } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { userId: clientUserId },
    );

  if (!!unrenderableUser) {
    const unrenderableShopItemPreview =
      await controller.databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByShopItemId(
        { shopItemId },
      );

    console.log("unrenderableShopItemPreview", unrenderableShopItemPreview);

    const chargeAmountMajorCurrencyUnits = unrenderableShopItemPreview.price;
    const chargeAmountMinorCurrencyUnits = chargeAmountMajorCurrencyUnits * 100;

    await controller.paymentProcessingService.chargeCustomer({
      userEmail: unrenderableUser.email,
      CREDIT_CARD_NUMBER,
      CREDIT_CARD_EXPIRATION_MONTH,
      CREDIT_CARD_EXPIRATION_YEAR,
      CREDIT_CARD_VERIFICATION_CODE,
      CREDIT_CARD_OWNER_NAME,
      chargeAmount: chargeAmountMinorCurrencyUnits,
    });

    return {
      success: {},
    };
  }

  return {
    error: {},
  };
}
