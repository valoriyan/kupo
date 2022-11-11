/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { v4 as uuidv4 } from "uuid";
import { constructPublishedItemFromPartsById } from "../../../controllers/publishedItem/utilities/constructPublishedItemsFromParts";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { constructRenderablePublishedItemCommentFromPartsById } from "../../publishedItem/publishedItemComment/utilities";
import { constructRenderableUserFromPartsByUserId } from "../../user/utilities";
import { RenderableNewCommentOnPublishedItemNotification } from "../models/renderableUserNotifications";

export async function assembleRecordAndSendNewCommentOnPublishedItemNotification({
  controller,
  publishedItemId,
  publishedItemCommentId,
  recipientUserId,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  publishedItemId: string;
  publishedItemCommentId: string;
  recipientUserId: string;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // COMPILE INFORMATION NEEDED TO WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////
  const constructPublishedItemFromPartsByIdResponse =
    await constructPublishedItemFromPartsById({
      controller,
      blobStorageService,
      databaseService,
      publishedItemId,
      requestorUserId: recipientUserId,
    });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  const constructRenderablePostCommentFromPartsByIdResponse =
    await constructRenderablePublishedItemCommentFromPartsById({
      controller,
      clientUserId: recipientUserId,
      publishedItemCommentId: publishedItemCommentId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderablePostCommentFromPartsByIdResponse.type === EitherType.failure) {
    return constructRenderablePostCommentFromPartsByIdResponse;
  }
  const { success: postComment } = constructRenderablePostCommentFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // WRITE NOTIFICATION INTO DATASTORE
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId: recipientUserId,
      userId: postComment.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userThatCommented } = constructRenderableUserFromPartsByUserIdResponse;

  const createUserNotificationResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
      {
        controller,
        userNotificationId: uuidv4(),
        recipientUserId,
        externalReference: {
          type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
          publishedItemCommentId,
        },
      },
    );
  if (createUserNotificationResponse.type === EitherType.failure) {
    return createUserNotificationResponse;
  }

  //////////////////////////////////////////////////
  // GET COUNT OF UNREAD NOTIFICATIONS
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: publishedItem.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // COMPILE AND SEND NOTIFICATION TO CLIENT
  //////////////////////////////////////////////////

  const renderableNewCommentOnPostNotification: RenderableNewCommentOnPublishedItemNotification =
    {
      countOfUnreadNotifications,
      type: NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
      eventTimestamp: Date.now(),
      userThatCommented,
      publishedItem,
      publishedItemComment: postComment,
    };

  await webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewCommentOnPost(
    {
      userId: recipientUserId,
      renderableNewCommentOnPostNotification,
    },
  );

  return Success({});
}
