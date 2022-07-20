import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities";
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
import { constructPublishedItemFromParts } from "../../publishedItem/utilities/constructPublishedItemsFromParts";

export async function assembleRenderableNewLikeOnPublishedItemNotification({
  controller,
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  controller: Controller;
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    RenderableNewLikeOnPublishedItemNotification
  >
> {
  const {
    reference_table_id: publishedItemLikeId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const getPublishedItemLikeByPublishedItemLikeIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPublishedItemLikeByPublishedItemLikeId(
      { controller, publishedItemLikeId },
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

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        controller,
        id: publishedItemId,
      },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const constructPublishedItemFromPartsResponse = await constructPublishedItemFromParts({
    controller,
    blobStorageService,
    databaseService,
    uncompiledBasePublishedItem: uncompiledBasePublishedItem,
    clientUserId,
  });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: renderablePublishedItem } = constructPublishedItemFromPartsResponse;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: userLikingPublishedItemId,
    });
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserThatLikedPublishedItem } = selectUserByUserIdResponse;

  if (!unrenderableUserThatLikedPublishedItem) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at at assembleRenderableNewLikeOnPublishedItemNotification",
      additionalErrorInformation:
        "User not found at at assembleRenderableNewLikeOnPublishedItemNotification",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
      unrenderableUser: unrenderableUserThatLikedPublishedItem,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userThatLikedPublishedItem } =
    constructRenderableUserFromPartsResponse;

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  return Success({
    countOfUnreadNotifications,
    userThatLikedPublishedItem,
    publishedItem: renderablePublishedItem,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
    eventTimestamp: parseInt(eventTimestampString),
  });
}
