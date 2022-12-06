import express from "express";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UnrenderableCanceledNewLikeOnPublishedItemNotification } from "../../notification/models/unrenderableCanceledUserNotifications";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";

export interface RemoveUserLikeFromPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoveUserLikeFromPublishedItemSuccess {}

export enum RemoveUserLikeFromPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleRemoveUserLikeFromPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: RemoveUserLikeFromPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | RemoveUserLikeFromPublishedItemFailedReason>,
    RemoveUserLikeFromPublishedItemSuccess
  >
> {
  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const removePublishedItemLikeByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.removePublishedItemLikeByUserId(
      {
        controller,
        publishedItemId,
        userId: clientUserId,
      },
    );
  if (removePublishedItemLikeByUserIdResponse.type === EitherType.failure) {
    return removePublishedItemLikeByUserIdResponse;
  }
  const { success: deletedPublishedItemLike } = removePublishedItemLikeByUserIdResponse;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePost } = getPublishedItemByIdResponse;

  const deleteUserNotificationForUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.deleteUserNotificationForUserId(
      {
        controller,
        recipientUserId: unrenderablePost.authorUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
          publishedItemLikeId: deletedPublishedItemLike.published_item_like_id,
        },
      },
    );
  if (deleteUserNotificationForUserIdResponse.type === EitherType.failure) {
    return deleteUserNotificationForUserIdResponse;
  }

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: unrenderablePost.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  const unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM,
      userIdUnlikingPost: clientUserId,
      publishedItemId: publishedItemId,
    };

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfCanceledNewLikeOnPost(
    {
      userId: unrenderablePost.authorUserId,
      unrenderableCanceledNewLikeOnPostNotification,
    },
  );

  return Success({});
}
