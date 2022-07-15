import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../../types/monads";
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
    GetCreditCardsStoredByUserIdFailedReason,
    GetCreditCardsStoredByUserIdSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
      { userId: clientUserId },
    );

  const dbCreditCardData =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
      { userId: clientUserId },
    );

  if (!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID || !dbCreditCardData) {
    return {
      type: EitherType.error,
      error: { reason: GetCreditCardsStoredByUserIdFailedReason.UNKNOWN_REASON },
    };
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

  return { type: EitherType.success, success: { cards: creditCardSummaries } };
}
