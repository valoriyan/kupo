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
import { CreditCardSummary } from "./models";

export interface GetCreditCardsStoredByUserIdSuccess {
  cards: CreditCardSummary[];
}

export enum GetCreditCardsStoredByUserIdFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleGetCreditCardsStoredByUserId({
  controller,
  request,
}: {
  controller: ShopItemController;
  request: express.Request;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetCreditCardsStoredByUserIdFailedReason>,
    GetCreditCardsStoredByUserIdSuccess
  >
> {
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

  const getCreditCardsStoredByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
      { controller, userId: clientUserId },
    );

  if (getCreditCardsStoredByUserIdResponse.type === EitherType.failure) {
    return getCreditCardsStoredByUserIdResponse;
  }
  const { success: dbCreditCardData } = getCreditCardsStoredByUserIdResponse;

  if (!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetCreditCardsStoredByUserIdFailedReason.UNKNOWN_REASON,
      error: "User not found at handleGetCreditCardsStoredByUserId",
      additionalErrorInformation: "User not found at handleGetCreditCardsStoredByUserId",
    });
  }
  if (!dbCreditCardData) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetCreditCardsStoredByUserIdFailedReason.UNKNOWN_REASON,
      error: "Credit card data not found for user at handleGetCreditCardsStoredByUserId",
      additionalErrorInformation:
        "Credit card data not found for user at handleGetCreditCardsStoredByUserId",
    });
  }

  const { paymentProcessorCustomerId } =
    unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID;

  const creditCardSummaries = await Promise.all(
    dbCreditCardData.map((dbCreditCardDatum) =>
      controller.paymentProcessingService.getCustomerCreditCardSummary({
        paymentProcessorCustomerId,
        dbCreditCardDatum,
      }),
    ),
  );

  return Success({ cards: creditCardSummaries });
}
