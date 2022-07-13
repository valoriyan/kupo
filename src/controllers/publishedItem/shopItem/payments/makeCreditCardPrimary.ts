import express from "express";
import { SecuredHTTPResponse } from "../../../../types/httpResponse";
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
  SecuredHTTPResponse<MakeCreditCardPrimaryFailedReason, MakeCreditCardPrimarySuccess>
> {
  const { localCreditCardId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  try {
    await controller.databaseService.tableNameToServicesMap.storedCreditCardDataTableService.makeCreditCardPrimary(
      {
        userId: clientUserId,
        localCreditCardId,
      },
    );

    return {
      success: {},
    };
  } catch (error) {
    console.log(error);
    return {
      error: {
        reason: MakeCreditCardPrimaryFailedReason.UNKNOWN_REASON,
      },
    };
  }
}
