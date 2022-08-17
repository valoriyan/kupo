import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";
import { v4 as uuidv4 } from "uuid";
import { RenderableChatMessage } from "./models";
import { getCountOfUnreadChatRooms } from "./utilities";

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
  const { chatRoomId, chatMessageText } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const chatMessageId: string = uuidv4();

  const creationTimestamp = Date.now();

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

  const getUserIdsJoinedToChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getUserIdsJoinedToChatRoomId(
      { controller, chatRoomId },
    );
  if (getUserIdsJoinedToChatRoomIdResponse.type === EitherType.failure) {
    return getUserIdsJoinedToChatRoomIdResponse;
  }
  const { success: userIds } = getUserIdsJoinedToChatRoomIdResponse;

  const getCountOfUnreadChatRoomsResponse = await getCountOfUnreadChatRooms({
    controller,
    databaseService: controller.databaseService,
    userId: clientUserId,
  });
  if (getCountOfUnreadChatRoomsResponse.type === EitherType.failure) {
    return getCountOfUnreadChatRoomsResponse;
  }
  const { success: countOfUnreadChatRooms } = getCountOfUnreadChatRoomsResponse;

  const chatMessage: RenderableChatMessage = {
    chatMessageId,
    text: chatMessageText,
    authorUserId: clientUserId,
    chatRoomId,
    creationTimestamp,
  };

  await controller.webSocketService.notifyUserIdsOfNewChatMessage({
    userIds,
    newChatMessageNotification: {
      countOfUnreadChatRooms,
      chatMessage,
    },
  });

  return Success({
    chatMessage,
  });
}
