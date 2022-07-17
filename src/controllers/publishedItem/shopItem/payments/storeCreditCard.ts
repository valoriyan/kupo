import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../../utilities/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";
import { v4 as uuidv4 } from "uuid";
import { GenericResponseFailedReason } from "../../../../controllers/models";

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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | StoreCreditCardFailedReason>,
    StoreCreditCardSuccess
  >
> {
  const now = Date.now();

  const ipAddressOfRequestor = (request.headers["x-real-ip"] ||
    request.socket.remoteAddress) as string;

  const { paymentProcessorCardToken } = requestBody;

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
    const storeCustomerCreditCardResponse =
      await controller.paymentProcessingService.storeCustomerCreditCard({
        controller,
        paymentProcessorCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
        paymentProcessorCardToken,
        ipAddressOfRequestor,
      });
    if (storeCustomerCreditCardResponse.type === EitherType.failure) {
      return storeCustomerCreditCardResponse;
    }
    const { success: paymentProcessorCardId } = storeCustomerCreditCardResponse;

    const getCreditCardsStoredByUserIdResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
        { controller, userId: clientUserId },
      );

    if (getCreditCardsStoredByUserIdResponse.type === EitherType.failure) {
      return getCreditCardsStoredByUserIdResponse;
    }
    const { success: creditCardsStoredByUserId } = getCreditCardsStoredByUserIdResponse;

    const currentCreditCardsCount = creditCardsStoredByUserId.length;

    const storeUserCreditCardDataResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.storeUserCreditCardData(
        {
          controller,
          userId: clientUserId,
          localCreditCardId: uuidv4(),
          paymentProcessorCardId,
          creationTimestamp: now,
          isPrimaryCard: !currentCreditCardsCount,
        },
      );
    if (storeUserCreditCardDataResponse.type === EitherType.failure) {
      return storeUserCreditCardDataResponse;
    }

    return Success({});
  }
  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
    error: "User not found at handleStoreCreditCard",
    additionalErrorInformation: "User not found at handleStoreCreditCard",
  });
}
