/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewShareOfPublishedItemNotification } from "../models/renderableUserNotifications";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { assemblePublishedItemById } from "../../publishedItem/utilities/assemblePublishedItems";
import { assembleRenderableUserById } from "../../../controllers/user/utilities/assembleRenderableUserById";

export async function assembleRenderableNewShareOfPublishedItemNotification({
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
    RenderableNewShareOfPublishedItemNotification
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const {
    published_item_reference: idOfSharedPublishedItem,
    timestamp_seen_by_user: timestampSeenByUser,
  } = userNotification;

  //////////////////////////////////////////////////
  // Read the Published Item that Was Created
  //////////////////////////////////////////////////
  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: idOfSharedPublishedItem! },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: newPublishedItem } = getPublishedItemByIdResponse;

  const idOfOriginPublishedItem = newPublishedItem.idOfPublishedItemBeingShared!;

  //////////////////////////////////////////////////
  // Assemble the Renderable Published Item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsResponse = await assemblePublishedItemById({
    controller,
    blobStorageService,
    databaseService,
    publishedItemId: idOfOriginPublishedItem,
    requestorUserId: clientUserId,
  });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: sourcePublishedItem } = constructPublishedItemFromPartsResponse;

  //////////////////////////////////////////////////
  // Assemble the Renderable User That Liked the Published Item
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: clientUserId,
    userId: newPublishedItem.authorUserId,
    blobStorageService,
    databaseService,
  });
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: userSharingPublishedItem } = constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // Get the Count of Unread Notifications
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
    timestampSeenByUser,
    type: NOTIFICATION_EVENTS.NEW_SHARE_OF_PUBLISHED_ITEM,
    eventTimestamp: newPublishedItem.creationTimestamp,
    userSharingPublishedItem,
    sourcePublishedItem,
    newPublishedItemId: idOfSharedPublishedItem!,
  });
}
