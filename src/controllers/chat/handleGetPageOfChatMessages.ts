import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { RenderableChatMessage } from "./models";

export interface GetPageOfChatMessagesRequestBody {
  chatRoomId: string;

  cursor?: string;
  pageSize: number;
}

export interface GetPageOfChatMessagesSuccess {
  chatMessages: RenderableChatMessage[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfChatMessagesFailedReason {
  UnknownCause = "Unknown Cause",
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
    ErrorReasonTypes<string | GetPageOfChatMessagesFailedReason>,
    GetPageOfChatMessagesSuccess
  >
> {
  const { chatRoomId, pageSize, cursor } = requestBody;

  const endOfPageTimestamp = cursor ? +cursor : Date.now() + 1;

  const { errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const getChatMessagesByChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.getChatMessagesByChatRoomId(
      { controller, chatRoomId, beforeTimestamp: endOfPageTimestamp },
    );
  if (getChatMessagesByChatRoomIdResponse.type === EitherType.failure) {
    return getChatMessagesByChatRoomIdResponse;
  }
  const { success: unrenderableChatMessages } = getChatMessagesByChatRoomIdResponse;

  const renderableChatMessages = unrenderableChatMessages.map(
    (unrenderableChatMessage) => unrenderableChatMessage,
  );

  const pageOfRenderableChatMessages = renderableChatMessages.slice(-pageSize);

  const previousPageCursor =
    renderableChatMessages.length > pageSize
      ? pageOfRenderableChatMessages[0].creationTimestamp.toString()
      : undefined;

  return Success({
    chatMessages: pageOfRenderableChatMessages,
    previousPageCursor: previousPageCursor,
    nextPageCursor: cursor,
  });
}
