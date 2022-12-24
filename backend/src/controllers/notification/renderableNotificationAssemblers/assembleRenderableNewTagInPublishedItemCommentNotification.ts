import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePublishedItemCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { constructPublishedItemFromPartsById } from "../../../controllers/publishedItem/utilities/constructPublishedItemsFromParts";
import { constructRenderableUserFromPartsByUserId } from "../../../controllers/user/utilities";

export async function assembleRenderableNewTagInPublishedItemCommentNotification({
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
    RenderableNewTagInPublishedItemCommentNotification
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
  // Get Published Item Comment
  //////////////////////////////////////////////////

  const getMaybePublishedItemCommentByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getMaybePublishedItemCommentById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { controller, publishedItemCommentId: publishedItemCommentId! },
    );
  if (getMaybePublishedItemCommentByIdResponse.type === EitherType.failure) {
    return getMaybePublishedItemCommentByIdResponse;
  }
  const { success: maybeUnrenderablePublishedItemComment } =
    getMaybePublishedItemCommentByIdResponse;

  if (!maybeUnrenderablePublishedItemComment) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: `Published item with publishedItemCommentId "${publishedItemCommentId}" not found at assembleRenderableNewTagInPublishedItemCommentNotification`,
      additionalErrorInformation: `Published item with publishedItemCommentId "${publishedItemCommentId}" not found at assembleRenderableNewTagInPublishedItemCommentNotification`,
    });
  }
  const unrenderablePublishedItemComment = maybeUnrenderablePublishedItemComment;

  const constructRenderablePublishedItemCommentFromPartsResponse =
    await constructRenderablePublishedItemCommentFromParts({
      controller,
      blobStorageService,
      databaseService,
      unrenderablePublishedItemComment: unrenderablePublishedItemComment,
      clientUserId,
    });
  if (
    constructRenderablePublishedItemCommentFromPartsResponse.type === EitherType.failure
  ) {
    return constructRenderablePublishedItemCommentFromPartsResponse;
  }
  const { success: publishedItemComment } =
    constructRenderablePublishedItemCommentFromPartsResponse;

  //////////////////////////////////////////////////
  // Get User Tagging Client
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId: clientUserId,
      userId: unrenderablePublishedItemComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Get Published Item Containing Comment
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsByIdResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId: publishedItemComment.publishedItemId,
      requestorUserId: clientUserId,
    });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

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
