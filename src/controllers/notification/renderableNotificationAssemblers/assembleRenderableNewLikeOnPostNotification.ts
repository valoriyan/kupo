import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewLikeOnPostNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";

export async function assembleRenderableNewLikeOnPostNotification({
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
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableNewLikeOnPostNotification>
> {
  const {
    reference_table_id: publishedItemLikeId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const getPostLikeByPublishedItemLikeIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.getPostLikeByPublishedItemLikeId(
      { controller, publishedItemLikeId },
    );
  if (getPostLikeByPublishedItemLikeIdResponse.type === EitherType.failure) {
    return getPostLikeByPublishedItemLikeIdResponse;
  }
  const {
    success: {
      published_item_id: postId,
      user_id: userLikingPostId,
      timestamp: eventTimestampString,
    },
  } = getPostLikeByPublishedItemLikeIdResponse;

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        controller,
        id: postId,
      },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePostWithoutElementsOrHashtags } =
    getPublishedItemByIdResponse;

  const constructRenderablePostFromPartsResponse = await constructRenderablePostFromParts(
    {
      controller,
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem: unrenderablePostWithoutElementsOrHashtags,
      clientUserId,
    },
  );
  if (constructRenderablePostFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsResponse;
  }
  const { success: post } = constructRenderablePostFromPartsResponse;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: userLikingPostId,
    });
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserThatLikedPost } = selectUserByUserIdResponse;

  if (!unrenderableUserThatLikedPost) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at at assembleRenderableNewLikeOnPostNotification",
      additionalErrorInformation:
        "User not found at at assembleRenderableNewLikeOnPostNotification",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
      unrenderableUser: unrenderableUserThatLikedPost,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userThatLikedPost } = constructRenderableUserFromPartsResponse;

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
    userThatLikedPost,
    post,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
    eventTimestamp: parseInt(eventTimestampString),
  });
}
