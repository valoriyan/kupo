import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { v4 as uuidv4 } from "uuid";
import { RenderableChatMessage } from "./models";

export enum CreateChatMessageFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface CreateChatMessageSuccess {
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
  SecuredHTTPResponse<CreateChatMessageFailedReason, CreateChatMessageSuccess>
> {
  const { chatRoomId, chatMessageText } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
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

  return {
    type: EitherType.success,
    success: {
      chatMessage,
    },
  };
}
