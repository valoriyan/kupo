/* eslint-disable @typescript-eslint/ban-types */
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../services/databaseService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

export const deleteBaseRenderablePublishedItemComponents = async ({
  controller,
  databaseService,
  publishedItemId,
  requestingUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  publishedItemId: string;
  requestingUserId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  const deletePublishedItemResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.deletePublishedItem(
      {
        controller,
        id: publishedItemId,
        authorUserId: requestingUserId,
      },
    );
  if (deletePublishedItemResponse.type === EitherType.failure) {
    return deletePublishedItemResponse;
  }

  const deleteAssociatedPostLikesResponse = await deleteAssociatedPostLikes({
    controller,
    databaseService,
    publishedItemId,
  });
  if (deleteAssociatedPostLikesResponse.type === EitherType.failure) {
    return deleteAssociatedPostLikesResponse;
  }
  const { postLikeIds } = deleteAssociatedPostLikesResponse.success;

  const deleteAssociatedNotificationsResponse = await deleteAssociatedNotifications({
    controller,
    databaseService,
    postLikeIds,
  });
  if (deleteAssociatedNotificationsResponse.type === EitherType.failure) {
    return deleteAssociatedNotificationsResponse;
  }

  const deleteAssociatedSavedItemsResponse = await deleteAssociatedSavedItems({
    controller,
    databaseService,
    userId: requestingUserId,
    publishedItemId,
  });
  if (deleteAssociatedSavedItemsResponse.type === EitherType.failure) {
    return deleteAssociatedSavedItemsResponse;
  }

  return Success({});
};

const deleteAssociatedPostLikes = async ({
  controller,
  databaseService,
  publishedItemId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  publishedItemId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, { postLikeIds: string[] }>
> => {
  const getPostLikesByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPostLikesByPublishedItemId(
      {
        controller,
        publishedItemId,
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
      await databaseService.tableNameToServicesMap.publishedItemLikesTableService.removeAllPostLikesByPublishedItemId(
        { controller, publishedItemId },
      );
    if (removeAllPostLikesByPublishedItemIdResponse.type === EitherType.failure) {
      return removeAllPostLikesByPublishedItemIdResponse;
    }
  }

  return Success({ postLikeIds });
};

const deleteAssociatedNotifications = async ({
  controller,
  databaseService,
  postLikeIds,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  postLikeIds: string[];
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  if (postLikeIds.length > 0) {
    const deleteUserNotificationsForAllUsersByReferenceTableIdsResponse =
      await databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationsForAllUsersByReferenceTableIds(
        {
          controller,
          notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
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

  return Success({});
};

const deleteAssociatedSavedItems = async ({
  controller,
  databaseService,
  userId,
  publishedItemId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  userId: string;
  publishedItemId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> => {
  const doesUserIdSavePublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
      {
        controller,
        userId,
        publishedItemId,
      },
    );
  if (doesUserIdSavePublishedItemIdResponse.type === EitherType.failure) {
    return doesUserIdSavePublishedItemIdResponse;
  }
  const { success: userIdSavedItemId } = doesUserIdSavePublishedItemIdResponse;

  if (userIdSavedItemId) {
    const unSaveItemResponse =
      await databaseService.tableNameToServicesMap.savedItemsTableService.unSaveItem({
        controller,
        userId,
        publishedItemId,
      });
    if (unSaveItemResponse.type === EitherType.failure) {
      return unSaveItemResponse;
    }
  }

  return Success({});
};
