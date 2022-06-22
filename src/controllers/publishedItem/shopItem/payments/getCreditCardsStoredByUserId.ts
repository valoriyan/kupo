import express from "express";
import { SecuredHTTPResponse } from "../../../../types/httpResponse";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";
import { CreditCardSummary } from "./models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetCreditCardsStoredByUserIdRequestBody {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetCreditCardsStoredByUserIdSuccess {
  cards: CreditCardSummary[];
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetCreditCardsStoredByUserIdFailed {}

export async function handleGetCreditCardsStoredByUserId({
  controller,
  request,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: GetCreditCardsStoredByUserIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetCreditCardsStoredByUserIdFailed,
    GetCreditCardsStoredByUserIdSuccess
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const creditCardSummaries =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.getCreditCardsStoredByUserId(
      {
        userId: clientUserId,
      },
    );

  return {
    success: {
      cards: creditCardSummaries,
    },
  };
}
