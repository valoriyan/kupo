import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { v4 as uuidv4 } from "uuid";

export enum CreateChatMessageInNewChatRoomFailedReason {
  UnknownCause = "Unknown Cause",
  RoomAlreadyExists = "Room Already Exists",
}

export interface CreateChatMessageInNewChatRoomFailed {
  reason: CreateChatMessageInNewChatRoomFailedReason;
}

export interface CreateChatMessageInNewChatRoomSuccess {
  chatRoomId: string;
}

export interface CreateChatMessageInNewRoomRequestBody {
  chatMessageText: string;
  userIds: string[];
}

export async function handleCreateChatMessageInNewChatRoom({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: CreateChatMessageInNewRoomRequestBody;
}): Promise<
  SecuredHTTPResponse<
    CreateChatMessageInNewChatRoomFailed,
    CreateChatMessageInNewChatRoomSuccess
  >
> {
  const { userIds, chatMessageText } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  let chatRoomId: string;

  const existingChatRoomId =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomIdWithUserIdMembersExclusive(
      { userIds },
    );

  if (!!existingChatRoomId) {
    chatRoomId = existingChatRoomId;
  } else {
    chatRoomId = uuidv4();

    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.insertUsersIntoChatRoom(
      {
        userIds,
        joinTimestamp: Date.now(),
        chatRoomId,
      },
    );
  }

  const chatMessageId: string = uuidv4();

  await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.createChatMessage(
    {
      chatMessageId,
      text: chatMessageText,
      authorUserId: clientUserId,
      chatRoomId,
      creationTimestamp: Date.now(),
    },
  );

  return {
    success: {
      chatRoomId,
    },
  };
}
