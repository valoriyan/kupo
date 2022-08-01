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
  const { localCreditCardId } = requestBody;

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
  const { success: creditCardsStoredByUserId } = getCreditCardsStoredByUserIdResponse;

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

  const remainingCards = creditCardsStoredByUserId.filter(
    (card) => card.local_credit_card_id !== localCreditCardId,
  );
  const cardIdToMakePrimary = remainingCards.reduce((acc, cur) => {
    if (cur.is_primary_card) return undefined;
    return acc;
  }, remainingCards[remainingCards.length - 1]?.local_credit_card_id as string | undefined);

  if (cardIdToMakePrimary) {
    const makeCreditCardPrimaryResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.makeCreditCardPrimary(
        { controller, userId: clientUserId, localCreditCardId: cardIdToMakePrimary },
      );

    if (makeCreditCardPrimaryResponse.type === EitherType.failure) {
      return makeCreditCardPrimaryResponse;
    }
  }

  if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
    const unstoreCreditCardResponse =
      await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.unstoreCreditCard(
        { controller, userId: clientUserId, localCreditCardId },
      );
    if (unstoreCreditCardResponse.type === EitherType.failure) {
      return unstoreCreditCardResponse;
    }

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

    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 404,
    reason: RemoveCreditCardFailedReason.UNKNOWN_REASON,
    error: "User not found at handleRemoveCreditCard",
    additionalErrorInformation: "User not found at handleRemoveCreditCard",
  });
}
