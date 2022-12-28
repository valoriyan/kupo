import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewTagInPublishedItemCaptionNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { assemblePublishedItemById } from "../../../controllers/publishedItem/utilities/constructPublishedItemsFromParts";
import { assembleRenderableUserById } from "../../user/utilities/assembleRenderableUserById";

export async function assembleRenderableNewTagInPublishedItemCaptionNotification({
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
    RenderableNewTagInPublishedItemCaptionNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    published_item_reference: publishedItemId,
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
  // Get Published Item
  //////////////////////////////////////////////////
  const constructPublishedItemFromPartsByIdResponse = await assemblePublishedItemById({
    controller,
    blobStorageService,
    databaseService,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    publishedItemId: publishedItemId!,
    requestorUserId: clientUserId,
  });
  if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsByIdResponse;
  }
  const { success: publishedItem } = constructPublishedItemFromPartsByIdResponse;

  //////////////////////////////////////////////////
  // Get User Tagging Client
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsByUserIdResponse =
    await assembleRenderableUserById({
      controller,
      requestorUserId: clientUserId,
      userId: publishedItem.authorUserId,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: userTaggingClient } = constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION,
    countOfUnreadNotifications,
    // TODO: Fix this to edit timestamp
    eventTimestamp: publishedItem.creationTimestamp,
    timestampSeenByUser,
    userTaggingClient,
    publishedItem,
  });
}
