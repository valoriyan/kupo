import express from "express";
import { SecuredHTTPResponse } from "../../../../types/httpResponse";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";
import { v4 as uuidv4 } from "uuid";

export interface StoreCreditCardRequestBody {
  paymentProcessorCardToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StoreCreditCardSuccess {}

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

  const { paymentProcessorCardToken } = requestBody;

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
    const paymentProcessorCardId =
      await controller.paymentProcessingService.storeCustomerCreditCard({
        paymentProcessorCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
        paymentProcessorCardToken,
        ipAddressOfRequestor,
      });

    const currentCreditCardsCount = (
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
        { userId: clientUserId },
      )
    ).length;

    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.storeUserCreditCardData(
      {
        userId: clientUserId,
        localCreditCardId: uuidv4(),
        paymentProcessorCardId,
        creationTimestamp: now,
        isPrimaryCard: !currentCreditCardsCount,
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
