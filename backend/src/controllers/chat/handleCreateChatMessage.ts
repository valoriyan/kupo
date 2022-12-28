import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
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
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreateChatMessageFailedReason>,
    CreateChatMessageSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { chatRoomId, chatMessageText } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const chatMessageId: string = uuidv4();

  const creationTimestamp = Date.now();

  //////////////////////////////////////////////////
  // Write to DB
  //////////////////////////////////////////////////
  const createChatMessageResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.createChatMessage(
      {
        controller,
        chatMessageId,
        text: chatMessageText,
        authorUserId: clientUserId,
        chatRoomId,
        creationTimestamp,
      },
    );
  if (createChatMessageResponse.type === EitherType.failure) {
    return createChatMessageResponse;
  }

  //////////////////////////////////////////////////
  // Get Users In Chatroom
  //////////////////////////////////////////////////
  const getUserIdsJoinedToChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getUserIdsJoinedToChatRoomId(
      { controller, chatRoomId },
    );
  if (getUserIdsJoinedToChatRoomIdResponse.type === EitherType.failure) {
    return getUserIdsJoinedToChatRoomIdResponse;
  }
  const { success: allUserIdsInChatRoom } = getUserIdsJoinedToChatRoomIdResponse;

  //////////////////////////////////////////////////
  // Get Count Of Chat Rooms With Unread Messages
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
  // Compile Chat Message
  //////////////////////////////////////////////////
  const chatMessage: RenderableChatMessage = {
    chatMessageId,
    text: chatMessageText,
    authorUserId: clientUserId,
    chatRoomId,
    creationTimestamp,
  };

  //////////////////////////////////////////////////
  // Send Chat Message to Target Users
  //////////////////////////////////////////////////

  await controller.webSocketService.notifyUserIdsOfNewChatMessage({
    userIds: allUserIdsInChatRoom,
    newChatMessageNotification: {
      countOfUnreadChatRooms,
      chatMessage,
    },
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    chatMessage,
  });
}
