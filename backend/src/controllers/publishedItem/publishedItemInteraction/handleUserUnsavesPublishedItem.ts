import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface UserUnsavesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUnsavesPublishedItemSuccess {}

export enum UserUnsavesPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUserUnsavesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserUnsavesPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UserUnsavesPublishedItemFailedReason>,
    UserUnsavesPublishedItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

  const unsaveItemResponse =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unsaveItem(
      {
        controller,
        userId: clientUserId,
        publishedItemId: publishedItemId,
      },
    );
  if (unsaveItemResponse.type === EitherType.failure) {
    return unsaveItemResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
