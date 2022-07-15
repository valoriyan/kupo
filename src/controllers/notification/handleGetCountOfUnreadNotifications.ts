import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";

export interface GetCountOfUnreadNotificationsSuccess {
  count: number;
}

export enum GetCountOfUnreadNotificationsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetCountOfUnreadNotifications({
  controller,
  request,
}: {
  controller: NotificationController;
  request: express.Request;
}): Promise<
  SecuredHTTPResponse<
    GetCountOfUnreadNotificationsFailedReason,
    GetCountOfUnreadNotificationsSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const countOfUnreadNotifications =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
      { userId: clientUserId },
    );

  return {
    type: EitherType.success,
    success: {
      count: countOfUnreadNotifications,
    },
  };
}
