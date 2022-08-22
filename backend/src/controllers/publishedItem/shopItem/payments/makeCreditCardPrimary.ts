import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../../utilities/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { ShopItemController } from "../shopItemController";

export interface MakeCreditCardPrimaryRequestBody {
  localCreditCardId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MakeCreditCardPrimarySuccess {}

export enum MakeCreditCardPrimaryFailedReason {
  UNKNOWN_REASON = "UNKNOWN_REASON",
}

export async function handleMakeCreditCardPrimary({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: MakeCreditCardPrimaryRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | MakeCreditCardPrimaryFailedReason>,
    MakeCreditCardPrimarySuccess
  >
> {
  const { localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const makeCreditCardPrimaryResponse =
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.makeCreditCardPrimary(
      {
        controller,
        userId: clientUserId,
        localCreditCardId,
      },
    );

  if (makeCreditCardPrimaryResponse.type === EitherType.failure) {
    return makeCreditCardPrimaryResponse;
  }

  return Success({});
}
