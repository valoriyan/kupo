/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { ChatController } from "./chatController";

export enum MarkChatRoomAsReadFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface MarkChatRoomAsReadSuccess {
  countOfUnreadChatRooms: number;
}

export interface MarkChatRoomAsReadRequestBody {
  chatRoomId: string;
}

export async function handleMarkChatRoomAsRead({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: MarkChatRoomAsReadRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | MarkChatRoomAsReadFailedReason>,
    MarkChatRoomAsReadSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { chatRoomId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const timestamp = Date.now();

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////

  const recordChatRoomAsReadByUserIdAtTimestampResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomReadRecordsTableService.recordChatRoomAsReadByUserIdAtTimestamp(
      {
        controller,
        userId: clientUserId,
        chatRoomId,
        timestampLastReadByUser: timestamp,
      },
    );
  if (recordChatRoomAsReadByUserIdAtTimestampResponse.type === EitherType.failure) {
    return recordChatRoomAsReadByUserIdAtTimestampResponse;
  }

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
  const { success: countOfUnreadChatRooms } = getCountOfUnreadChatRoomsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ countOfUnreadChatRooms });
}
