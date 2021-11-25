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
  const { chatRoomId, pageSize, cursor } = requestBody;

  const endOfPageTimestamp = cursor ? +cursor : Date.now() + 1;

  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableChatMessages =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.getChatMessagesByChatRoomId(
      { chatRoomId, beforeTimestamp: endOfPageTimestamp },
    );

  const renderableChatMessages = unrenderableChatMessages.map(
    (unrenderableChatMessage) => unrenderableChatMessage,
  );

  console.log("pageSize", pageSize);
  console.log("cursor", cursor);

  const pageOfRenderableChatMessages = renderableChatMessages.slice(-pageSize);
  
  const startOfPageTimestamp = renderableChatMessages.length > pageSize ?
    pageOfRenderableChatMessages[0].creationTimestamp : 1



  return {
    success: {
      chatMessages: pageOfRenderableChatMessages,
      previousPageCursor: cursor,
      nextPageCursor: startOfPageTimestamp.toString(),
    },
  };
}
