import express from "express";
import { SecuredHTTPResponse } from "../../../../types/httpResponse";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";
import { v4 as uuidv4 } from "uuid";

export interface StoreCreditCardRequestBody {
  CREDIT_CARD_NUMBER: string;
  CREDIT_CARD_EXPIRATION_MONTH: string;
  CREDIT_CARD_EXPIRATION_YEAR: string;
  CREDIT_CARD_VERIFICATION_CODE: string;
  CREDIT_CARD_OWNER_NAME: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StoreCreditCardSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum StoreCreditCardFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleStoreCreditCard({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: StoreCreditCardRequestBody;
}): Promise<SecuredHTTPResponse<StoreCreditCardFailedReason, StoreCreditCardSuccess>> {
  const now = Date.now();

  const ipAddressOfRequestor = (request.headers["x-real-ip"] ||
    request.socket.remoteAddress) as string;

  const {
    CREDIT_CARD_NUMBER,
    CREDIT_CARD_EXPIRATION_MONTH,
    CREDIT_CARD_EXPIRATION_YEAR,
    CREDIT_CARD_VERIFICATION_CODE,
    CREDIT_CARD_OWNER_NAME,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { userId: clientUserId },
    );

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    const paymentProcessorCardId =
      await controller.paymentProcessingService.storeCustomerCreditCard({
        paymentProcessorCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
        CREDIT_CARD_NUMBER,
        CREDIT_CARD_EXPIRATION_MONTH,
        CREDIT_CARD_EXPIRATION_YEAR,
        CREDIT_CARD_VERIFICATION_CODE,
        CREDIT_CARD_OWNER_NAME,
        ipAddressOfRequestor,
      });

    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.storeUserCreditCardData(
      {
        userId: clientUserId,
        localCreditCardId: uuidv4(),
        creditCardLastFourDigits: CREDIT_CARD_NUMBER.slice(-4),
        paymentProcessorCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
        paymentProcessorCardId,
        creationTimestamp: now,
      },
    );

    return {
      success: {},
    };
  }

  return {
    error: {
      reason: StoreCreditCardFailedReason.UNKNOWN_REASON,
    },
  };
}
