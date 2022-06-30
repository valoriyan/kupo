import express from "express";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { HTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { UnrenderableCanceledNewLikeOnPostNotification } from "../../notification/models/unrenderableCanceledUserNotifications";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface RemoveUserLikeFromPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyRemovedUserLikeFromPostResponse {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToRemoveUserLikeFromPublishedItemResponse {}

export async function handleRemoveUserLikeFromPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: RemoveUserLikeFromPublishedItemRequestBody;
}): Promise<
  HTTPResponse<
    FailedToRemoveUserLikeFromPublishedItemResponse,
    SuccessfullyRemovedUserLikeFromPostResponse
  >
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const deletedPostLike =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.removePublishedItemLikeByUserId(
      {
        publishedItemId,
        userId: clientUserId,
      },
    );

  const unrenderablePost =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: publishedItemId },
    );

  await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
    {
      recipientUserId: unrenderablePost.authorUserId,
      notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
      referenceTableId: deletedPostLike.published_item_like_id,
    },
  );

  const countOfUnreadNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: unrenderablePost.authorUserId },
    );

  const unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPostNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.CANCELED_NEW_LIKE_ON_POST,
      userIdUnlikingPost: clientUserId,
      postId: publishedItemId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewLikeOnPost(
    {
      userId: unrenderablePost.authorUserId,
      unrenderableCanceledNewLikeOnPostNotification,
    },
  );

  return {};
}
