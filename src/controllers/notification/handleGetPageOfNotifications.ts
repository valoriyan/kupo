import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRenderableNewCommentOnPostNotification } from "./renderableNotificationAssemblers/assembleRenderableNewCommentOnPostNotification";
import { DBUserNotification } from "../../services/databaseService/tableServices/userNotificationsTableService";
import { assembleRenderableNewFollowerNotification } from "./renderableNotificationAssemblers/assembleRenderableNewFollowerNotification";
import { assembleRenderableNewLikeOnPostNotification } from "./renderableNotificationAssemblers/assembleRenderableNewLikeOnPostNotification";
import { RenderableUserNotification } from "./models/renderableUserNotifications";
import { decodeTimestampCursor } from "../utilities/pagination";
import { assembleRenderableNewTagInPublishedItemCommentNotification } from "./renderableNotificationAssemblers/assembleRenderableNewTagInPublishedItemCommentNotification";
import { GenericResponseFailedReason } from "../models";

export interface GetPageOfNotificationsRequestBody {
  cursor?: string;
  pageSize: number;
  isUserReadingNotifications?: boolean;
}

export interface GetPageOfNotificationsSuccess {
  userNotifications: RenderableUserNotification[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfNotificationsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetPageOfNotifications({
  controller,
  request,
  requestBody,
}: {
  controller: NotificationController;
  request: express.Request;
  requestBody: GetPageOfNotificationsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPageOfNotificationsFailedReason>,
    GetPageOfNotificationsSuccess
  >
> {
  const now = Date.now();

  const { isUserReadingNotifications, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  if (isUserReadingNotifications) {
    const markAllUserNotificationsAsSeenResponse =
      await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.markAllUserNotificationsAsSeen(
        {
          controller,
          recipientUserId: clientUserId,
          timestampSeenByUser: now,
        },
      );
    if (markAllUserNotificationsAsSeenResponse.type === EitherType.failure) {
      return markAllUserNotificationsAsSeenResponse;
    }
  }

  const selectUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectUserNotificationsByUserId(
      {
        controller,
        userId: clientUserId,
        limit: pageSize,
        getNotificationsUpdatedBeforeTimestamp: pageTimestamp,
      },
    );
  if (selectUserNotificationsByUserIdResponse.type === EitherType.failure) {
    return selectUserNotificationsByUserIdResponse;
  }
  const { success: userNotifications } = selectUserNotificationsByUserIdResponse;

  const assembleNotifcationsResponse = await assembleNotifcations({
    userNotifications,
    clientUserId,
    controller,
  });
  if (assembleNotifcationsResponse.type === EitherType.failure) {
    return assembleNotifcationsResponse;
  }
  const { success: renderableUserNotifications } = assembleNotifcationsResponse;

  return Success({
    userNotifications: renderableUserNotifications,
  });
}

async function assembleNotifcations({
  userNotifications,
  clientUserId,
  controller,
}: {
  userNotifications: DBUserNotification[];
  clientUserId: string;
  controller: NotificationController;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderableUserNotification[]>
> {
  const assembleRenderableNotificationResponses = await BluebirdPromise.map(
    userNotifications,
    async (
      userNotification,
    ): Promise<
      InternalServiceResponse<ErrorReasonTypes<string>, RenderableUserNotification | null>
    > => {
      if (
        userNotification.notification_type === NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST
      ) {
        return await assembleRenderableNewCommentOnPostNotification({
          controller,
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
        });
      } else if (
        userNotification.notification_type === NOTIFICATION_EVENTS.NEW_FOLLOWER
      ) {
        return await assembleRenderableNewFollowerNotification({
          controller,
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
        });
      } else if (
        userNotification.notification_type === NOTIFICATION_EVENTS.NEW_LIKE_ON_POST
      ) {
        return await assembleRenderableNewLikeOnPostNotification({
          controller,
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
        });
      } else if (
        userNotification.notification_type ===
        NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT
      ) {
        return await assembleRenderableNewTagInPublishedItemCommentNotification({
          controller,
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
        });
      } else {
        return Failure({
          controller,
          httpStatusCode: 500,
          reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
          error: "Unknown event type at assembleNotifcations",
          additionalErrorInformation: "Unknown event type at assembleNotifcations",
        });
      }
    },
  );

  const renderableUserNotificationsResponse = collectMappedResponses({
    mappedResponses: assembleRenderableNotificationResponses,
  });
  if (renderableUserNotificationsResponse.type === EitherType.failure) {
    return renderableUserNotificationsResponse;
  }
  const { success: renderableUserNotifications } = renderableUserNotificationsResponse;

  return Success(
    renderableUserNotifications.filter(
      (renderableUserNotification) => !!renderableUserNotification,
    ) as RenderableUserNotification[],
  );
}
