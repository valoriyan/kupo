import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePublishedItemCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewCommentOnPublishedItemNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { constructPublishedItemFromPartsById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";

export async function assembleRenderableNewCommentOnPostNotification({
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
    RenderableNewCommentOnPublishedItemNotification
  >
> {
  const {
    reference_table_id: publishedItemCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const getPostCommentByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getPublishedItemCommentById(
      { controller, publishedItemCommentId },
    );
  if (getPostCommentByIdResponse.type === EitherType.failure) {
    return getPostCommentByIdResponse;
  }
  const { success: unrenderablePostComment } = getPostCommentByIdResponse;

  const constructRenderablePostCommentFromPartsResponse =
    await constructRenderablePublishedItemCommentFromParts({
      controller,
      blobStorageService,
      databaseService,
      unrenderablePublishedItemComment: unrenderablePostComment,
      clientUserId,
    });
  if (constructRenderablePostCommentFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsResponse;
  }
  const { success: publishedItemComment } =
    constructRenderablePostCommentFromPartsResponse;

  const constructPublishedItemFromPartsResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId: publishedItemComment.publishedItemId,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: renderablePublishedItem } = constructPublishedItemFromPartsResponse;

  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: unrenderablePostComment.authorUserId,
      },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserThatCommented } = selectUserByUserIdResponse;

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: unrenderableUserThatCommented!,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userThatCommented } = constructRenderableUserFromPartsResponse;

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
    userThatCommented,
    publishedItem: renderablePublishedItem,
    publishedItemComment,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
    eventTimestamp: publishedItemComment.creationTimestamp,
  });
}
