import { v4 as uuidv4 } from "uuid";
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface UserSavesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSavesPublishedItemSuccess {}

export enum UserSavesPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUserSavesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserSavesPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UserSavesPublishedItemFailedReason>,
    UserSavesPublishedItemSuccess
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

  const saveId = uuidv4();

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

  const saveItemResponse =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.saveItem(
      {
        controller,
        saveId,
        publishedItemId,
        userId: clientUserId,
        creationTimestamp: Date.now(),
      },
    );
  if (saveItemResponse.type === EitherType.failure) {
    return saveItemResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
