import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../../types/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";

export interface RemoveCreditCardRequestBody {
  localCreditCardId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveCreditCardSuccess {}

export enum RemoveCreditCardFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleRemoveCreditCard({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: RemoveCreditCardRequestBody;
}): Promise<SecuredHTTPResponse<RemoveCreditCardFailedReason, RemoveCreditCardSuccess>> {
  const { localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { userId: clientUserId },
    );

  const dBStoredCreditCardDatum =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getStoredCreditCardByLocalId(
      { localCreditCardId },
    );

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.unstoreCreditCard(
      { userId: clientUserId, localCreditCardId },
    );

    await controller.paymentProcessingService.removeCustomerCreditCard({
      paymentProcessorCardId: dBStoredCreditCardDatum.payment_processor_card_id,
      paymentProcessorCustomerId:
        unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
    });

    return {
      type: EitherType.success,
      success: {},
    };
  }

  return {
    type: EitherType.error,
    error: {
      reason: RemoveCreditCardFailedReason.UNKNOWN_REASON,
    },
  };
}
