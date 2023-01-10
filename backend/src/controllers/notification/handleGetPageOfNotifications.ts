import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { NotificationController } from "./notificationController";
import { RenderableUserNotification } from "./models/renderableUserNotifications";
import { decodeTimestampCursor } from "../utilities/pagination";
import { assembleNotifications } from "./utilities/assembleNotifications";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const now = Date.now();

  const { isUserReadingNotifications, cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  //////////////////////////////////////////////////
  // Mark Notifications as Read
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Read Page of Notifications from DB
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Assemble Renderable Notifications
  //////////////////////////////////////////////////

  const assembleNotifcationsResponse = await assembleNotifications({
    userNotifications,
    clientUserId,
    controller,
  });
  if (assembleNotifcationsResponse.type === EitherType.failure) {
    return assembleNotifcationsResponse;
  }
  const { success: renderableUserNotifications } = assembleNotifcationsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    userNotifications: renderableUserNotifications,
  });
}
