import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePublishedItemCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";

export async function assembleRenderableNewTagInPublishedItemCommentNotification({
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
    RenderableNewTagInPublishedItemCommentNotification
  >
> {
  const {
    reference_table_id: publishedItemCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: clientUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  const getPostCommentByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getPublishedItemCommentById(
      { controller, publishedItemCommentId: publishedItemCommentId },
    );
  if (getPostCommentByIdResponse.type === EitherType.failure) {
    return getPostCommentByIdResponse;
  }
  const { success: unrenderablePublishedItemComment } = getPostCommentByIdResponse;

  const constructRenderablePostCommentFromPartsResponse =
    await constructRenderablePublishedItemCommentFromParts({
      controller,
      blobStorageService,
      databaseService,
      unrenderablePublishedItemComment: unrenderablePublishedItemComment,
      clientUserId,
    });
  if (constructRenderablePostCommentFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsResponse;
  }
  const { success: publishedItemComment } =
    constructRenderablePostCommentFromPartsResponse;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: unrenderablePublishedItemComment.authorUserId,
    });
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserTaggingClient } = selectUserByUserIdResponse;

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
      unrenderableUser: unrenderableUserTaggingClient!,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsResponse;

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        controller,
        id: publishedItemComment.publishedItemId,
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
  const { success: publishedItem } = constructRenderablePostFromPartsResponse;

  return Success({
    type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
    countOfUnreadNotifications,
    eventTimestamp: publishedItemComment.creationTimestamp,
    timestampSeenByUser,
    userTaggingClient,
    publishedItem,
    publishedItemComment,
  });
}
