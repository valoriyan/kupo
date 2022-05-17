import express from "express";
import { NOTIFICATION_EVENTS } from "../../services/webSocketService/eventsConfig";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRenderableNewCommentOnPostNotification } from "./renderableNotificationAssemblers/assembleRenderableNewCommentOnPostNotification";
import { DBUserNotification } from "../../services/databaseService/tableServices/userNotificationsTableService";
import { assembleRenderableNewFollowerNotification } from "./renderableNotificationAssemblers/assembleRenderableNewFollowerNotification";
import { assembleRenderableNewLikeOnPostNotification } from "./renderableNotificationAssemblers/assembleRenderableNewLikeOnPostNotification";
import { RenderableUserNotification } from "./models/renderableUserNotifications";
import { decodeCursor } from "../post/pagination/utilities";

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

export interface GetPageOfNotificationsFailed {
  reason: GetPageOfNotificationsFailedReason;
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
  SecuredHTTPResponse<GetPageOfNotificationsFailed, GetPageOfNotificationsSuccess>
> {
  const now = Date.now();

  const {isUserReadingNotifications, cursor, pageSize} = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeCursor({ encodedCursor: cursor })
    : 999999999999999;


  if (isUserReadingNotifications) {
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.markAllUserNotificationsAsSeen({
      recipientUserId: clientUserId,
      timestampSeenByUser: now,
    });
  }

  const userNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectUserNotificationsByUserId(
      { userId: clientUserId, limit: pageSize, getNotificationsUpdatedBeforeTimestamp: pageTimestamp },
    );

  const renderableUserNotifications = await assembleNotifcations({
    userNotifications,
    clientUserId,
    controller,
  });

  return {
    success: {
      userNotifications: renderableUserNotifications,
    },
  };
}

async function assembleNotifcations({
  userNotifications,
  clientUserId,
  controller,
}: {
  userNotifications: DBUserNotification[];
  clientUserId: string;
  controller: NotificationController;
}): Promise<RenderableUserNotification[]> {
  const renderableUserNotifications = await BluebirdPromise.map(
    userNotifications,
    async (userNotification): Promise<RenderableUserNotification | null> => {
      try {
        if (
          userNotification.notification_type === NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST
        ) {
          return await assembleRenderableNewCommentOnPostNotification({
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type === NOTIFICATION_EVENTS.NEW_FOLLOWER
        ) {
          return await assembleRenderableNewFollowerNotification({
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else if (
          userNotification.notification_type === NOTIFICATION_EVENTS.NEW_LIKE_ON_POST
        ) {
          return await assembleRenderableNewLikeOnPostNotification({
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
          });
        } else {
          throw new Error("Unknown event type");
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  );

  return renderableUserNotifications.filter(
    (renderableUserNotification) => !!renderableUserNotification,
  ) as RenderableUserNotification[];
}
