import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface UserSavesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSavesPublishedItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSavesPublishedItemFailed {}

export async function handleUserSavesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserSavesPublishedItemRequestBody;
}): Promise<HTTPResponse<UserSavesPublishedItemFailed, UserSavesPublishedItemSuccess>> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const saveId = uuidv4();

  await controller.databaseService.tableNameToServicesMap.savedItemsTableService.saveItem(
    {
      saveId,
      publishedItemId,
      userId: clientUserId,
      creationTimestamp: Date.now(),
    },
  );

  return {};
}
