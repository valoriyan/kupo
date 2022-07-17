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

export enum CreateChatMessageInNewChatRoomFailedReason {
  UnknownCause = "Unknown Cause",
  RoomAlreadyExists = "Room Already Exists",
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
    ErrorReasonTypes<string | CreateChatMessageInNewChatRoomFailedReason>,
    CreateChatMessageInNewChatRoomSuccess
  >
> {
  const { userIds, chatMessageText } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  let chatRoomId: string;

  const getChatRoomIdWithUserIdMembersExclusiveResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomIdWithUserIdMembersExclusive(
      { controller, userIds },
    );
  if (getChatRoomIdWithUserIdMembersExclusiveResponse.type === EitherType.failure) {
    return getChatRoomIdWithUserIdMembersExclusiveResponse;
  }
  const { success: existingChatRoomId } = getChatRoomIdWithUserIdMembersExclusiveResponse;

  if (!!existingChatRoomId) {
    chatRoomId = existingChatRoomId;
  } else {
    chatRoomId = uuidv4();

    const insertUsersIntoChatRoomResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.insertUsersIntoChatRoom(
        {
          controller,
          userIds,
          joinTimestamp: Date.now(),
          chatRoomId,
        },
      );
    if (insertUsersIntoChatRoomResponse.type === EitherType.failure) {
      return insertUsersIntoChatRoomResponse;
    }
  }

  const chatMessageId: string = uuidv4();

  const createChatMessageResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.createChatMessage(
      {
        controller,
        chatMessageId,
        text: chatMessageText,
        authorUserId: clientUserId,
        chatRoomId,
        creationTimestamp: Date.now(),
      },
    );
  if (createChatMessageResponse.type === EitherType.failure) {
    return createChatMessageResponse;
  }

  return Success({
    chatRoomId,
  });
}
