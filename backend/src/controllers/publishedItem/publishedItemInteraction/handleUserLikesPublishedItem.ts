import { v4 as uuidv4 } from "uuid";
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
import { RenderableNewLikeOnPublishedItemNotification } from "../../notification/models/renderableUserNotifications";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";
import { constructPublishedItemFromParts } from "../utilities/constructPublishedItemsFromParts";
import { GenericResponseFailedReason } from "../../../controllers/models";

export interface UserLikesPublishedItemRequestBody {
  publishedItemId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserLikesPublishedItemSuccess {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export enum UserLikesPublishedItemFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUserLikesPublishedItem({
  controller,
  request,
  requestBody,
}: {
  controller: PublishedItemInteractionController;
  request: express.Request;
  requestBody: UserLikesPublishedItemRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UserLikesPublishedItemFailedReason>,
    UserLikesPublishedItemSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const now = Date.now();

  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishedItemLikeId = uuidv4();

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const createPublishedItemLikeFromUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.createPublishedItemLikeFromUserId(
      {
        controller,
        publishedItemLikeId: publishedItemLikeId,
        publishedItemId,
        userId: clientUserId,
        timestamp: now,
      },
    );

  if (createPublishedItemLikeFromUserIdResponse.type === EitherType.failure) {
    return createPublishedItemLikeFromUserIdResponse;
  }

  //////////////////////////////////////////////////
  // Get the associated Published Item
  //////////////////////////////////////////////////

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  //////////////////////////////////////////////////
  // Get Client User
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: clientUserId,
      },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUnrenderableClientUser } = selectMaybeUserByUserIdResponse;

  if (!maybeUnrenderableClientUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleUserLikesPublishedItem",
      additionalErrorInformation: "User not found at handleUserLikesPublishedItem",
    });
  }

  const unrenderableClientUser = maybeUnrenderableClientUser;

  //////////////////////////////////////////////////
  // Write user notification to DB
  //////////////////////////////////////////////////

  if (uncompiledBasePublishedItem.authorUserId !== clientUserId) {
    const createUserNotificationResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
        {
          controller,
          userNotificationId: uuidv4(),
          recipientUserId: uncompiledBasePublishedItem.authorUserId,
          externalReference: {
            type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
            publishedItemLikeId,
          },
        },
      );
    if (createUserNotificationResponse.type === EitherType.failure) {
      return createUserNotificationResponse;
    }
  }

  //////////////////////////////////////////////////
  // Compile client user
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: unrenderableClientUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: clientUser } = constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // Compile published item
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsResponse = await constructPublishedItemFromParts({
    controller,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItem: uncompiledBasePublishedItem,
    requestorUserId: clientUserId,
  });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: renderablePublishedItem } = constructPublishedItemFromPartsResponse;

  //////////////////////////////////////////////////
  // Get count of unread notifications
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { controller, userId: uncompiledBasePublishedItem.authorUserId },
    );
  if (selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectCountOfUnreadUserNotificationsByUserIdResponse;
  }
  const { success: countOfUnreadNotifications } =
    selectCountOfUnreadUserNotificationsByUserIdResponse;

  //////////////////////////////////////////////////
  // Compile user notification
  //////////////////////////////////////////////////

  const renderableNewLikeOnPublishedItemNotification: RenderableNewLikeOnPublishedItemNotification =
    {
      eventTimestamp: now,
      type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
      countOfUnreadNotifications,
      userThatLikedPublishedItem: clientUser,
      publishedItem: renderablePublishedItem,
    };

  //////////////////////////////////////////////////
  // Emit user notification
  //////////////////////////////////////////////////

  await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewLikeOnPublishedItem(
    {
      renderableNewLikeOnPublishedItemNotification:
        renderableNewLikeOnPublishedItemNotification,
      userId: uncompiledBasePublishedItem.authorUserId,
    },
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
