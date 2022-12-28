import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { assembleRenderablePublishedItemCommentFromCachedComponents } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewCommentOnPublishedItemNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assemblePublishedItemById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";

export async function assembleRenderableNewCommentOnPostNotification({
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
    RenderableNewCommentOnPublishedItemNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const {
    published_item_comment_reference: publishedItemCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Get Unrenderable Published Item Comment
  //////////////////////////////////////////////////

  const getMaybePublishedItemCommentByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getMaybePublishedItemCommentById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { controller, publishedItemCommentId: publishedItemCommentId! },
    );
  if (getMaybePublishedItemCommentByIdResponse.type === EitherType.failure) {
    return getMaybePublishedItemCommentByIdResponse;
  }
  const { success: maybeUnrenderablePostComment } =
    getMaybePublishedItemCommentByIdResponse;

  if (!maybeUnrenderablePostComment) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Published Item Comment not found at assembleRenderableNewCommentOnPostNotification",
      additionalErrorInformation:
        "Published Item Comment not found at assembleRenderableNewCommentOnPostNotification",
    });
  }

  const unrenderablePostComment = maybeUnrenderablePostComment;

  //////////////////////////////////////////////////
  // Assemble Renderable Published Item Comment
  //////////////////////////////////////////////////

  const constructRenderablePostCommentFromPartsResponse =
    await assembleRenderablePublishedItemCommentFromCachedComponents({
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

  //////////////////////////////////////////////////
  // Assemble Renderable Published Item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsResponse = await assemblePublishedItemById({
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

  //////////////////////////////////////////////////
  // Assemble Renderable User That Commented
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: clientUserId,
    userId: unrenderablePostComment.authorUserId,
    blobStorageService,
    databaseService,
  });
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userThatCommented } = constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // Get Count of Unread Notifications
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
    userThatCommented,
    publishedItem: renderablePublishedItem,
    publishedItemComment,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
    eventTimestamp: publishedItemComment.creationTimestamp,
  });
}
