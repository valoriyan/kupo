import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../../utilities/monads";
import { checkAuthentication } from "../../../auth/utilities";
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | RemoveCreditCardFailedReason>,
    RemoveCreditCardSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Select User With Payment Info
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
      reason: RemoveCreditCardFailedReason.UNKNOWN_REASON,
      error: "User not found at handleRemoveCreditCard",
      additionalErrorInformation: "User not found at handleRemoveCreditCard",
    });
  }

  const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
    maybeUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID;

  //////////////////////////////////////////////////
  // Get Credit Cards Stored By Client
  //////////////////////////////////////////////////

  const getCreditCardsStoredByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
      { controller, userId: clientUserId },
    );

  if (getCreditCardsStoredByUserIdResponse.type === EitherType.failure) {
    return getCreditCardsStoredByUserIdResponse;
  }
  const { success: creditCardsStoredByUserId } = getCreditCardsStoredByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Credit Card Being Deleted
  //////////////////////////////////////////////////

  const dBStoredCreditCardDatum = creditCardsStoredByUserId.find(
    (card) => card.local_credit_card_id === localCreditCardId,
  );
  if (!dBStoredCreditCardDatum)
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: RemoveCreditCardFailedReason.UNKNOWN_REASON,
      error: "Failed to find credit card to remove",
      additionalErrorInformation: "Failed to find credit card to remove",
    });

  //////////////////////////////////////////////////
  // Get Credit Cards Remaining
  //////////////////////////////////////////////////

  const remainingCards = creditCardsStoredByUserId.filter(
    (card) => card.local_credit_card_id !== localCreditCardId,
  );

  //////////////////////////////////////////////////
  // Select New Primary Credit Card
  //////////////////////////////////////////////////

  const cardIdToMakePrimary = remainingCards.reduce((acc, cur) => {
    if (cur.is_primary_card) return undefined;
    return acc;
  }, remainingCards[remainingCards.length - 1]?.local_credit_card_id as string | undefined);

  //////////////////////////////////////////////////
  // Update Primary Credit Card Selection in DB
  //////////////////////////////////////////////////

  if (cardIdToMakePrimary) {
    const makeCreditCardPrimaryResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.makeCreditCardPrimary(
        { controller, userId: clientUserId, localCreditCardId: cardIdToMakePrimary },
      );

    if (makeCreditCardPrimaryResponse.type === EitherType.failure) {
      return makeCreditCardPrimaryResponse;
    }
  }

  //////////////////////////////////////////////////
  // Delete Credit Card from DB
  //////////////////////////////////////////////////

  const unstoreCreditCardResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.unstoreCreditCard(
      { controller, userId: clientUserId, localCreditCardId },
    );
  if (unstoreCreditCardResponse.type === EitherType.failure) {
    return unstoreCreditCardResponse;
  }

  //////////////////////////////////////////////////
  // Delete Credit Card from Payment Processor
  //////////////////////////////////////////////////

  const removeCustomerCreditCardResponse =
    await controller.paymentProcessingService.removeCustomerCreditCard({
      controller,
      paymentProcessorCardId: dBStoredCreditCardDatum.payment_processor_card_id,
      paymentProcessorCustomerId:
        unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID.paymentProcessorCustomerId,
    });
  if (removeCustomerCreditCardResponse.type === EitherType.failure) {
    return removeCustomerCreditCardResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
