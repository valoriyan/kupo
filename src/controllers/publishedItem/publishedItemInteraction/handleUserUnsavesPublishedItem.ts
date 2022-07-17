import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  HTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface UserUnsavesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUnsavesPublishedItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUnsavesPublishedItemFailed {}

export async function handleUserUnsavesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserUnsavesPublishedItemRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | UserUnsavesPublishedItemFailed>,
    UserUnsavesPublishedItemSuccess
  >
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unSaveItemResponse =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem(
      {
        controller,
        userId: clientUserId,
        publishedItemId: publishedItemId,
      },
    );
  if (unSaveItemResponse.type === EitherType.failure) {
    return unSaveItemResponse;
  }

  return Success({});
}
