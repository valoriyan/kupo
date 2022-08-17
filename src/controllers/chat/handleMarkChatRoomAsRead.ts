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

export enum MarkChatRoomAsReadFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface MarkChatRoomAsReadSuccess {}

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
  const { chatRoomId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const timestamp = Date.now();

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

  return Success({});
}
