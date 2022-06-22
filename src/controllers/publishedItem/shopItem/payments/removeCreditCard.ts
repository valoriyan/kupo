import express from "express";
import { SecuredHTTPResponse } from "../../../../types/httpResponse";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveCreditCardRequestBody {
  localCreditCardId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveCreditCardSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveCreditCardFailed {}

export async function handleRemoveCreditCard({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: RemoveCreditCardRequestBody;
}): Promise<SecuredHTTPResponse<RemoveCreditCardFailed, RemoveCreditCardSuccess>> {
  const {
    localCreditCardId,
  } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;


  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { userId: clientUserId },
    );

  const dBStoredCreditCardDatum = await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getStoredCreditCardByLocalId({localCreditCardId});

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.unstoreCreditCard({userId: clientUserId, localCreditCardId});

    await controller.paymentProcessingService.removeCustomerCreditCard({
      paymentProcessorCardId: dBStoredCreditCardDatum.payment_processor_card_id,
      paymentProcessorCustomerId: unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
    });

    return {
      success: {},
    };
  }


  return {
    error: {},
  };
}
