import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";

export interface GetCountOfUnreadNotificationsByUserIdRequestBody {
  userId: number;
}

export interface GetCountOfUnreadNotificationsByUserIdSuccess {
  count: number;
}

export enum GetCountOfUnreadNotificationsByUserIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetCountOfUnreadNotificationsByUserIdFailed {
  reason: GetCountOfUnreadNotificationsByUserIdFailedReason;
}

export async function handleGetCountOfUnreadNotificationsByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: NotificationController;
  request: express.Request;
  requestBody: GetCountOfUnreadNotificationsByUserIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetCountOfUnreadNotificationsByUserIdFailed,
    GetCountOfUnreadNotificationsByUserIdSuccess
  >
> {
  console.log(requestBody);

  const { clientUserId, error } = await checkAuthorization(controller, request);
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
