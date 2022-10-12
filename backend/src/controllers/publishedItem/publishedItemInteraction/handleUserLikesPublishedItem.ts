import { v4 as uuidv4 } from "uuid";
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { constructRenderableUserFromParts } from "../../user/utilities/constructRenderableUserFromParts";
import { RenderableNewLikeOnPublishedItemNotification } from "../../notification/models/renderableUserNotifications";
import { PublishedItemInteractionController } from "./publishedItemInteractionController";
import { constructPublishedItemFromParts } from "../utilities/constructPublishedItemsFromParts";

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
  const now = Date.now();

  const { publishedItemId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const postLikeId = uuidv4();

  const createPublishedItemLikeFromUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemLikesTableService.createPublishedItemLikeFromUserId(
      {
        controller,
        publishedItemLikeId: postLikeId,
        publishedItemId,
        userId: clientUserId,
        timestamp: now,
      },
    );

  if (createPublishedItemLikeFromUserIdResponse.type === EitherType.failure) {
    return createPublishedItemLikeFromUserIdResponse;
  }

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: unrenderablePostWithoutElementsOrHashtags } =
    getPublishedItemByIdResponse;

  const doesUserNotificationExistResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.doesUserNotificationExist(
      {
        controller,
        userId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
        referenceTableId: publishedItemId,
      },
    );
  if (doesUserNotificationExistResponse.type === EitherType.failure) {
    return doesUserNotificationExistResponse;
  }
  const { success: doesNotificationExist } = doesUserNotificationExistResponse;

  if (doesNotificationExist) {
    const setLastUpdatedTimestampResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.setLastUpdatedTimestamp(
        {
          controller,
          userNotificationId: uuidv4(),
          newUpdateTimestamp: now,
        },
      );
    if (setLastUpdatedTimestampResponse.type === EitherType.failure) {
      return setLastUpdatedTimestampResponse;
    }
  } else {
    if (unrenderablePostWithoutElementsOrHashtags.authorUserId !== clientUserId) {
      const createUserNotificationResponse =
        await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.createUserNotification(
          {
            controller,
            userNotificationId: uuidv4(),
            recipientUserId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
            notificationType: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
            referenceTableId: postLikeId,
          },
        );
      if (createUserNotificationResponse.type === EitherType.failure) {
        return createUserNotificationResponse;
      }
    }
  }

  const selectUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: clientUserId,
      },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableClientUser } = selectUserByUserIdResponse;

  if (!!unrenderableClientUser) {
    const constructRenderableUserFromPartsResponse =
      await constructRenderableUserFromParts({
        controller,
        requestorUserId: clientUserId,
        unrenderableUser: unrenderableClientUser,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
      });
    if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
      return constructRenderableUserFromPartsResponse;
    }
    const { success: clientUser } = constructRenderableUserFromPartsResponse;

    const constructPublishedItemFromPartsResponse = await constructPublishedItemFromParts(
      {
        controller,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        uncompiledBasePublishedItem: unrenderablePostWithoutElementsOrHashtags,
        requestorUserId: clientUserId,
      },
    );
    if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
      return constructPublishedItemFromPartsResponse;
    }
    const { success: renderablePublishedItem } = constructPublishedItemFromPartsResponse;

    const selectCountOfUnreadUserNotificationsByUserIdResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
        { controller, userId: unrenderablePostWithoutElementsOrHashtags.authorUserId },
      );
    if (
      selectCountOfUnreadUserNotificationsByUserIdResponse.type === EitherType.failure
    ) {
      return selectCountOfUnreadUserNotificationsByUserIdResponse;
    }
    const { success: countOfUnreadNotifications } =
      selectCountOfUnreadUserNotificationsByUserIdResponse;

    const renderableNewLikeOnPostNotification: RenderableNewLikeOnPublishedItemNotification =
      {
        eventTimestamp: now,
        type: NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
        countOfUnreadNotifications,
        userThatLikedPublishedItem: clientUser,
        publishedItem: renderablePublishedItem,
      };

    await controller.webSocketService.userNotificationsWebsocketService.notifyUserIdOfNewLikeOnPost(
      {
        renderableNewLikeOnPostNotification,
        userId: unrenderablePostWithoutElementsOrHashtags.authorUserId,
      },
    );
  }

  return Success({});
}
