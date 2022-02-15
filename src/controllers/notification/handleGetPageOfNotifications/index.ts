import express from "express";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import {
  RenderableUserNotification,
} from "../models";
import { NotificationController } from "../notificationController";
import { Promise as BluebirdPromise } from "bluebird";
import { assembleRenderableNewCommentOnPostNotification } from "./assembleRenderableNewCommentOnPostNotification";
import { assembleRenderableNewFollowerNotification } from "./assembleRenderableNewFollowerNotification";
import { assembleRenderableNewLikeOnPostNotification } from "./assembleRenderableNewLikeOnPostNotification";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";

export interface GetPageOfNotificationsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface SuccessfullyGotPageOfNotificationsResponse {
  userNotifications: RenderableUserNotification[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPageOfNotificationsResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetPageOfNotificationsResponse {
  reason: FailedtoGetPageOfNotificationsResponseReason;
}

async function assembleNotifcations({
  userNotifications,
  clientUserId,
  controller,
}: {
  userNotifications: DBUserNotification[]
  clientUserId: string;
  controller: NotificationController;
}): Promise<RenderableUserNotification[]>{
  const renderableUserNotifications = await BluebirdPromise.map(
    userNotifications,
    async (userNotification): Promise<RenderableUserNotification> => {
        if (userNotification.notification_type === NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST) {
          return await assembleRenderableNewCommentOnPostNotification({
            userNotification,
            blobStorageService: controller.blobStorageService,
            databaseService: controller.databaseService,
            clientUserId,
        });
      } else if (userNotification.notification_type === NOTIFICATION_EVENTS.NEW_FOLLOWER) {
        return await assembleRenderableNewFollowerNotification({
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
      });
      

      } else if (userNotification.notification_type === NOTIFICATION_EVENTS.NEW_LIKE_ON_POST) {
        return await assembleRenderableNewLikeOnPostNotification({
          userNotification,
          blobStorageService: controller.blobStorageService,
          databaseService: controller.databaseService,
          clientUserId,
      });

      } else {
        throw new Error("Unknown event type");
      }
    },
  )

  return renderableUserNotifications;

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
    FailedtoGetPageOfNotificationsResponse,
    SuccessfullyGotPageOfNotificationsResponse
  >
> {
  console.log(requestBody);

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userNotifications  = await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectUserNotificationsByUserId({userId: clientUserId});



  const renderableUserNotifications = await assembleNotifcations({userNotifications, clientUserId, controller});

  return {
    success: {
      userNotifications: renderableUserNotifications,
    },
  };
}
