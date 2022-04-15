import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { SavedItemType } from "./models";
import { UserInteractionController } from "./userInteractionController";

export interface UserUnsavesPostRequestBody {
  postId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUnsavesPostSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUnsavesPostFailed {}

export async function handleRemoveUserLikeFromPost({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UserUnsavesPostRequestBody;
}): Promise<
  HTTPResponse<
    UserUnsavesPostFailed,
    UserUnsavesPostSuccess
  >
> {
  const { postId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem(
      {
          userId: clientUserId,
          itemType: SavedItemType.post,
          itemId: postId,
      },
    );

  return {};
}
