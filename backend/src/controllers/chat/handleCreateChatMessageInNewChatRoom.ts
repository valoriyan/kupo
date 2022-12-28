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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { userIds, chatMessageText } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Determine if Chat Room Already Exists
  //////////////////////////////////////////////////

  const getChatRoomIdWithUserIdMembersExclusiveResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomIdWithJoinedUserIdMembersExclusive(
      { controller, userIds: new Set(userIds) },
    );
  if (getChatRoomIdWithUserIdMembersExclusiveResponse.type === EitherType.failure) {
    return getChatRoomIdWithUserIdMembersExclusiveResponse;
  }
  const { success: existingChatRoomId } = getChatRoomIdWithUserIdMembersExclusiveResponse;

  //////////////////////////////////////////////////
  // If the chat room already exists,w we have its ID
  //////////////////////////////////////////////////

  let chatRoomId: string;

  if (!!existingChatRoomId) {
    chatRoomId = existingChatRoomId;
  } else {
    //////////////////////////////////////////////////
    // Create a new chatRoom if the chat room does not already exist
    //////////////////////////////////////////////////

    chatRoomId = uuidv4();

    const joinUsersWithChatRoomResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.joinUsersWithChatRoom(
        {
          controller,
          userIds,
          joinTimestamp: Date.now(),
          chatRoomId,
        },
      );
    if (joinUsersWithChatRoomResponse.type === EitherType.failure) {
      return joinUsersWithChatRoomResponse;
    }
  }

  //////////////////////////////////////////////////
  // Create the chat message
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    chatRoomId,
  });
}
