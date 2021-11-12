import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { v4 as uuidv4 } from "uuid";

export enum CreateChatMessageFailureReasons {
  UnknownCause = "Unknown Cause",
}

export interface FailedToCreateChatMessageResponse {
  reason: CreateChatMessageFailureReasons;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulChatMessageCreationResponse {}

export interface CreateChatMessageRequestBody {
  chatMessageText: string;
  postId: string;
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
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const chatMessageId: string = uuidv4();

  await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.createChatMessage(
    {
      chatMessageId,
      text: requestBody.chatMessageText,
      authorUserId: clientUserId,
      chatRoomId: requestBody.chatRoomId,
      creationTimestamp: Date.now(),
    },
  );

  return { success: {} };
}
