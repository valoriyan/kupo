import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";

export interface GetCountOfUnreadNotificationsSuccess {
  count: number;
}

export enum GetCountOfUnreadNotificationsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetCountOfUnreadNotificationsFailed {
  reason: GetCountOfUnreadNotificationsFailedReason;
}

export async function handleGetCountOfUnreadNotifications({
  controller,
  request,
}: {
  controller: NotificationController;
  request: express.Request;
}): Promise<
  SecuredHTTPResponse<
    GetCountOfUnreadNotificationsFailed,
    GetCountOfUnreadNotificationsSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const countOfUnreadNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: clientUserId },
    );

  return {
    success: {
      count: countOfUnreadNotifications,
    },
  };
}
