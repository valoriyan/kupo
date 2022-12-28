import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { assembleRenderableUserFromCachedComponents } from "../../user/utilities/assembleRenderableUserFromCachedComponents";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewLikeOnPublishedItemNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../models";
import { assemblePublishedItemById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";

export async function assembleRenderableNewLikeOnPublishedItemNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    RenderableNewLikeOnPublishedItemNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    published_item_like_reference: publishedItemLikeId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Get the Published Item Like Data
  //////////////////////////////////////////////////

  const getPublishedItemLikeByPublishedItemLikeIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPublishedItemLikeByPublishedItemLikeId(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { controller, publishedItemLikeId: publishedItemLikeId! },
    );
  if (getPublishedItemLikeByPublishedItemLikeIdResponse.type === EitherType.failure) {
    return getPublishedItemLikeByPublishedItemLikeIdResponse;
  }
  const {
    success: {
      published_item_id: publishedItemId,
      user_id: userLikingPublishedItemId,
      timestamp: eventTimestampString,
    },
  } = getPublishedItemLikeByPublishedItemLikeIdResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable Published Item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsResponse = await assemblePublishedItemById({
    controller,
    blobStorageService,
    databaseService,
    publishedItemId,
    requestorUserId: clientUserId,
  });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: renderablePublishedItem } = constructPublishedItemFromPartsResponse;

  //////////////////////////////////////////////////
  // Get the Unrenderable User That Liked the Published Item
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: userLikingPublishedItemId,
      },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUnrenderableUserThatLikedPublishedItem } =
    selectMaybeUserByUserIdResponse;

  if (!maybeUnrenderableUserThatLikedPublishedItem) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at at assembleRenderableNewLikeOnPublishedItemNotification",
      additionalErrorInformation:
        "User not found at at assembleRenderableNewLikeOnPublishedItemNotification",
    });
  }

  const unrenderableUserThatLikedPublishedItem =
    maybeUnrenderableUserThatLikedPublishedItem;

  //////////////////////////////////////////////////
  // Assemble the Renderable User That Liked the Published Item
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse =
    await assembleRenderableUserFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: unrenderableUserThatLikedPublishedItem,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userThatLikedPublishedItem } =
    constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    countOfUnreadNotifications,
    userThatLikedPublishedItem,
    publishedItem: renderablePublishedItem,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
    eventTimestamp: parseInt(eventTimestampString),
  });
}
