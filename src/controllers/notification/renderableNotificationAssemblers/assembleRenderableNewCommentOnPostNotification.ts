import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostCommentFromParts } from "../../publishedItem/publishedItemComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewCommentOnPostNotification } from "../models/renderableUserNotifications";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";

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
    RenderableNewCommentOnPostNotification
  >
> {
  const {
    reference_table_id: postCommentId,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  const getPostCommentByIdResponse =
    await databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      { controller, postCommentId },
    );
  if (getPostCommentByIdResponse.type === EitherType.failure) {
    return getPostCommentByIdResponse;
  }
  const { success: unrenderablePostComment } = getPostCommentByIdResponse;

  const constructRenderablePostCommentFromPartsResponse =
    await constructRenderablePostCommentFromParts({
      controller,
      blobStorageService,
      databaseService,
      unrenderablePostComment,
      clientUserId,
    });
  if (constructRenderablePostCommentFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsResponse;
  }
  const { success: postComment } = constructRenderablePostCommentFromPartsResponse;

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      {
        controller,
        id: postComment.postId,
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
      userId: unrenderablePostComment.authorUserId,
    });
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUserThatCommented } = selectUserByUserIdResponse;

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
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
    post,
    postComment,
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
    eventTimestamp: postComment.creationTimestamp,
  });
}
