import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";
import { checkAuthentication } from "../../../auth/utilities";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get User Id With Payment Info
  //////////////////////////////////////////////////

  const selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { controller, userId: clientUserId },
    );

  if (
    selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse.type ===
    EitherType.failure
  ) {
    return selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;
  }
  const { success: maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID } =
    selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;

  if (!maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetCreditCardsStoredByUserIdFailedReason.UNKNOWN_REASON,
      error: "User not found at handleGetCreditCardsStoredByUserId",
      additionalErrorInformation: "User not found at handleGetCreditCardsStoredByUserId",
    });
  }

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID;

  const { paymentProcessorCustomerId } =
    unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID;

  //////////////////////////////////////////////////
  // Get Credit Cards Pointers for User
  //////////////////////////////////////////////////

  const getCreditCardsStoredByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
      { controller, userId: clientUserId },
    );

  if (getCreditCardsStoredByUserIdResponse.type === EitherType.failure) {
    return getCreditCardsStoredByUserIdResponse;
  }
  const { success: dbCreditCardData } = getCreditCardsStoredByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Credit Cards for User
  //////////////////////////////////////////////////

  const getCustomerCreditCardSummaryResponses = await Promise.all(
    dbCreditCardData.map((dbCreditCardDatum) =>
      controller.paymentProcessingService.getCustomerCreditCardSummary({
        controller,
        paymentProcessorCustomerId,
        dbCreditCardDatum,
      }),
    ),
  );

  const mappedGetCustomerCreditCardSummaryResponses = unwrapListOfEitherResponses({
    eitherResponses: getCustomerCreditCardSummaryResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedGetCustomerCreditCardSummaryResponses.type === EitherType.failure) {
    return mappedGetCustomerCreditCardSummaryResponses;
  }
  const { success: creditCardSummaries } = mappedGetCustomerCreditCardSummaryResponses;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ cards: creditCardSummaries });
}
