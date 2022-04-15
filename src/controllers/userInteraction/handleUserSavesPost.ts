import { v4 as uuidv4 } from "uuid";
import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { SavedItemType } from "./models";

export interface UserSavesPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSavesPostSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSavesPostFailed {}

export async function handleUserSavesPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UserSavesPostRequestBody;
}): Promise<
  HTTPResponse<UserSavesPostFailed, UserSavesPostSuccess>
> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const saveId = uuidv4();

  await controller.databaseService.tableNameToServicesMap.savedItemsTableService.saveItem(
    {
        saveId,
        itemId: postId,
        itemType: SavedItemType.post,
        userId: clientUserId,
        timestamp: Date.now(),
    },
  );

  return {};
}
