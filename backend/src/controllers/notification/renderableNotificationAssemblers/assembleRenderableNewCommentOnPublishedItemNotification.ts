import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePublishedItemCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
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
import { constructPublishedItemFromPartsById } from "../../publishedItem/utilities/constructPublishedItemsFromParts";
import { GenericResponseFailedReason } from "../../../controllers/models";

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
    published_item_comment_reference: publishedItemCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

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
