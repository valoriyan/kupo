import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
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
    ErrorReasonTypes<string | GetCountOfUnreadNotificationsFailedReason>,
    GetCountOfUnreadNotificationsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read the Count of Unread Notifications from DB
  //////////////////////////////////////////////////

  const selectCountOfUnreadUserNotificationsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
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
    count: countOfUnreadNotifications,
  });
}
