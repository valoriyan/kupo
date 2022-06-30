import express from "express";
import { HTTPResponse } from "../../../types/httpResponse";
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
  HTTPResponse<UserUnsavesPublishedItemFailed, UserUnsavesPublishedItemSuccess>
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem(
    {
      userId: clientUserId,
      publishedItemId: publishedItemId,
    },
  );

  return {};
}
