import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { v4 as uuidv4 } from "uuid";
import { RenderableChatMessage } from "./models";

export enum CreateChatMessageFailureReasons {
  UnknownCause = "Unknown Cause",
}

export interface FailedToCreateChatMessageResponse {
  reason: CreateChatMessageFailureReasons;
}

export interface SuccessfulChatMessageCreationResponse {
  chatMessage: RenderableChatMessage;
}

export interface CreateChatMessageRequestBody {
  chatMessageText: string;
  chatRoomId: string;
}

export async function handleCreateChatMessage({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: CreateChatMessageRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToCreateChatMessageResponse,
    SuccessfulChatMessageCreationResponse
  >
> {
  const { chatRoomId, chatMessageText } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const chatMessageId: string = uuidv4();

  const creationTimestamp = Date.now();

  await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.createChatMessage(
    {
      chatMessageId,
      text: chatMessageText,
      authorUserId: clientUserId,
      chatRoomId,
      creationTimestamp,
    },
  );

  const userIds =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getUserIdsJoinedToChatRoomId(
      { chatRoomId },
    );

  const chatMessage: RenderableChatMessage = {
    chatMessageId,
    text: chatMessageText,
    authorUserId: clientUserId,
    chatRoomId,
    creationTimestamp,
  };

  await controller.webSocketService.notifyUserIdsOfNewChatMessage({
    userIds,
    chatMessage,
  });

  return { success: {
    chatMessage,
  } };
}
