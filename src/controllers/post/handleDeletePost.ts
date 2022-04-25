import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { SavedItemType } from "../userInteraction/models";
import { PostController } from "./postController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePostFailed {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeletePostSuccess {}

export interface DeletePostRequestBody {
  postId: string;
}

export async function handleDeletePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: DeletePostRequestBody;
}): Promise<SecuredHTTPResponse<DeletePostFailed, DeletePostSuccess>> {
  const { error, clientUserId } = await checkAuthorization(controller, request);
  if (error) return error;

  const { postId } = requestBody;

  await controller.databaseService.tableNameToServicesMap.postsTableService.deletePost({
    postId,
    authorUserId: clientUserId,
  });

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED BLOB FILES
  //////////////////////////////////////////////////
  const blobPointers =
    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.deletePostContentElementsByPostId(
      { postId },
    );

  await controller.blobStorageService.deleteImages({ blobPointers });

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED POST LIKES
  //////////////////////////////////////////////////

  const dbPostLikes =
    await controller.databaseService.tableNameToServicesMap.postLikesTableService.getPostLikesByPostId(
      { postId },
    );
  const postLikeIds = dbPostLikes.map(({ post_like_id }) => post_like_id);

  if (dbPostLikes.length > 0) {
    await controller.databaseService.tableNameToServicesMap.postLikesTableService.removeAllPostLikesByPostId(
      { postId },
    );
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED NOTIFICATIONS
  //////////////////////////////////////////////////

  if (postLikeIds.length > 0) {
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationsForAllUsersByReferenceTableIds(
      {
        notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
        referenceTableIds: postLikeIds,
      },
    );
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED SAVED POSTS
  //////////////////////////////////////////////////

  const userIdSavedItemId = await controller.databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSaveItemId({
    userId: clientUserId,
    itemId: postId,
    itemType: SavedItemType.post,
  });

  if (userIdSavedItemId) {
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem({
      userId: clientUserId,
      itemId: postId,
      itemType: SavedItemType.post,  
    });
  }


  return {};
}
