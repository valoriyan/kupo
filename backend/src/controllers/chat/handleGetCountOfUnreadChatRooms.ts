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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Count of Unread Chat Rooms
  //////////////////////////////////////////////////

  const getCountOfUnreadChatRoomsResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getCountOfUnreadChatRoomsByUserId(
      {
        controller,
        userId: clientUserId,
      },
    );
  if (getCountOfUnreadChatRoomsResponse.type === EitherType.failure) {
    return getCountOfUnreadChatRoomsResponse;
  }
  const { success: count } = getCountOfUnreadChatRoomsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ count });
}
