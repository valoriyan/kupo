import express from "express";
import { checkAuthorization } from "../../../controllers/auth/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
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
}): Promise<
  SecuredHTTPResponse<ErrorReasonTypes<string | DeletePostFailed>, DeletePostSuccess>
> {
  const { errorResponse: error, clientUserId } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { postId } = requestBody;

  const deletePublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.deletePublishedItem(
      {
        controller,
        id: postId,
        authorUserId: clientUserId,
      },
    );
  if (deletePublishedItemResponse.type === EitherType.failure) {
    return deletePublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED BLOB FILES
  //////////////////////////////////////////////////
  const deletePostContentElementsByPostIdResponse =
    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.deletePostContentElementsByPostId(
      {
        controller,
        postId,
      },
    );
  if (deletePostContentElementsByPostIdResponse.type === EitherType.failure) {
    return deletePostContentElementsByPostIdResponse;
  }
  const { success: blobPointers } = deletePostContentElementsByPostIdResponse;

  await controller.blobStorageService.deleteImages({ blobPointers });

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED POST LIKES
  //////////////////////////////////////////////////

  const getPostLikesByPublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPostLikesByPublishedItemId(
      {
        controller,
        publishedItemId: postId,
      },
    );
  if (getPostLikesByPublishedItemIdResponse.type === EitherType.failure) {
    return getPostLikesByPublishedItemIdResponse;
  }
  const { success: dbPostLikes } = getPostLikesByPublishedItemIdResponse;

  const postLikeIds = dbPostLikes.map(
    ({ published_item_like_id: post_like_id }) => post_like_id,
  );

  if (dbPostLikes.length > 0) {
    const removeAllPostLikesByPublishedItemIdResponse =
      await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.removeAllPostLikesByPublishedItemId(
        { controller, publishedItemId: postId },
      );
    if (removeAllPostLikesByPublishedItemIdResponse.type === EitherType.failure) {
      return removeAllPostLikesByPublishedItemIdResponse;
    }
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED NOTIFICATIONS
  //////////////////////////////////////////////////

  if (postLikeIds.length > 0) {
    const deleteUserNotificationsForAllUsersByReferenceTableIdsResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationsForAllUsersByReferenceTableIds(
        {
          controller,
          notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
          referenceTableIds: postLikeIds,
        },
      );
    if (
      deleteUserNotificationsForAllUsersByReferenceTableIdsResponse.type ===
      EitherType.failure
    ) {
      return deleteUserNotificationsForAllUsersByReferenceTableIdsResponse;
    }
  }

  //////////////////////////////////////////////////
  // DELETE ASSOCIATED SAVED POSTS
  //////////////////////////////////////////////////

  const doesUserIdSavePublishedItemIdResponse =
    await controller.databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
      {
        controller,
        userId: clientUserId,
        publishedItemId: postId,
      },
    );
  if (doesUserIdSavePublishedItemIdResponse.type === EitherType.failure) {
    return doesUserIdSavePublishedItemIdResponse;
  }
  const { success: userIdSavedItemId } = doesUserIdSavePublishedItemIdResponse;

  if (userIdSavedItemId) {
    const unSaveItemResponse =
      await controller.databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem(
        {
          controller,
          userId: clientUserId,
          publishedItemId: postId,
        },
      );
    if (unSaveItemResponse.type === EitherType.failure) {
      return unSaveItemResponse;
    }
  }

  return Success({});
}
