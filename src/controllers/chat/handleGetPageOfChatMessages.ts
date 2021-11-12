import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { RenderableChatMessage } from "./models";

export interface GetPageOfChatMessagesRequestBody {
  chatRoomId: string;

  cursor?: string;
  pageSize: number;
}

export interface SuccessfulGetPageOfChatMessagesResponse {
  chatMessages: RenderableChatMessage[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPageOfChatMessagesResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetPageOfChatMessagesResponse {
  reason: FailedtoGetPageOfChatMessagesResponseReason;
}

export async function handleGetPageOfChatMessages({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetPageOfChatMessagesRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedtoGetPageOfChatMessagesResponse,
    SuccessfulGetPageOfChatMessagesResponse
  >
> {
  const { chatRoomId } = requestBody;

  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableChatMessages =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.getChatMessagesByChatRoomId(
      { chatRoomId },
    );

  const renderableChatMessages = unrenderableChatMessages.map(
    (unrenderableChatMessage) => unrenderableChatMessage,
  );

  return {
    success: {
      chatMessages: renderableChatMessages,
    },
  };
}
