import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
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
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
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
  //////////////////////////////////////////////////
  // INPUTS & AUTH
  //////////////////////////////////////////////////

  const { chatRoomId, pageSize, cursor } = requestBody;

  const endOfPageTimestamp = cursor ? +cursor : Date.now() + 1;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Check that user is in the chat room
  //////////////////////////////////////////////////
  const getUserIdsJoinedToChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getUserIdsJoinedToChatRoomId(
      { controller, chatRoomId },
    );
  if (getUserIdsJoinedToChatRoomIdResponse.type === EitherType.failure) {
    return getUserIdsJoinedToChatRoomIdResponse;
  }
  const { success: userIdsInChatRoom } = getUserIdsJoinedToChatRoomIdResponse;

  if (!userIdsInChatRoom.includes(clientUserId)) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GetPageOfChatMessagesFailedReason.ILLEGAL_ACCESS,
      error: "Illegal Access at handleGetPageOfChatMessages",
      additionalErrorInformation: "Illegal Access at handleGetPageOfChatMessages",
    });
  }

  //////////////////////////////////////////////////
  // Get users in the channel that blocked the client
  //////////////////////////////////////////////////

  const areAnyOfUserIdsBlockingUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userBlocksTableService.areAnyOfUserIdsBlockingUserId(
      {
        controller,
        maybeBlockedUserId: clientUserId,
        maybeExecutorUserIds: userIdsInChatRoom,
      },
    );
  if (areAnyOfUserIdsBlockingUserIdResponse.type === EitherType.failure) {
    return areAnyOfUserIdsBlockingUserIdResponse;
  }
  const { success: userIdsInChatRoomBlockingClient } =
    areAnyOfUserIdsBlockingUserIdResponse;

  //////////////////////////////////////////////////
  // Get unrenderable chat messages
  //////////////////////////////////////////////////

  const getChatMessagesByChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.getChatMessagesByChatRoomId(
      {
        controller,
        chatRoomId,
        beforeTimestamp: endOfPageTimestamp,
        excludedUserIds: userIdsInChatRoomBlockingClient,
      },
    );
  if (getChatMessagesByChatRoomIdResponse.type === EitherType.failure) {
    return getChatMessagesByChatRoomIdResponse;
  }
  const { success: unrenderableChatMessages } = getChatMessagesByChatRoomIdResponse;

  //////////////////////////////////////////////////
  // Get renderable chat messages
  //////////////////////////////////////////////////

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
