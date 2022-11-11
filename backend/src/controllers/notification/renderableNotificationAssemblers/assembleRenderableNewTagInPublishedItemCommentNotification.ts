import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePublishedItemCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromPartsById } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
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
    published_item_comment_reference: publishedItemCommentId,
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
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: unrenderablePublishedItemComment.authorUserId,
      },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserTaggingClient } = selectUserByUserIdResponse;

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: unrenderableUserTaggingClient!,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsResponse;

  const constructRenderablePostFromPartsResponse =
    await constructRenderablePostFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId: publishedItemComment.publishedItemId,
      requestorUserId: clientUserId,
    });
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
