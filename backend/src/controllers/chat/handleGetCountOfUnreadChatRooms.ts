/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { getCountOfUnreadChatRooms } from "./utilities";

export enum GetCountOfUnreadChatRoomsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetCountOfUnreadChatRoomsSuccess {
  count: number;
}

export interface GetCountOfUnreadChatRoomsRequestBody {}

export async function handleGetCountOfUnreadChatRooms({
  controller,
  request,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetCountOfUnreadChatRoomsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetCountOfUnreadChatRoomsFailedReason>,
    GetCountOfUnreadChatRoomsSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getCountOfUnreadChatRoomsResponse = await getCountOfUnreadChatRooms({
    controller,
    databaseService: controller.databaseService,
    userId: clientUserId,
  });
  if (getCountOfUnreadChatRoomsResponse.type === EitherType.failure) {
    return getCountOfUnreadChatRoomsResponse;
  }
  const { success: count } = getCountOfUnreadChatRoomsResponse;

  return Success({ count });
}
