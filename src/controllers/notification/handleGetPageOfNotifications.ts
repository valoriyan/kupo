import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { NotificationController } from "./notificationController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPageOfNotificationsRequestBody {}

export interface SuccessfullyGotPageOfNotificationsResponse {
  messages: string[];
}

export enum FailedtoGetPageOfNotificationsResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetPageOfNotificationsResponse {
  reason: FailedtoGetPageOfNotificationsResponseReason;
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
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  console.log(requestBody);

  return {
    success: {
      messages: [],
    },
  };
}
