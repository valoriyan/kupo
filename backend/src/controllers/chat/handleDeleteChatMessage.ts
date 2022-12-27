import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";

export enum DeleteChatMessageFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeleteChatMessageSuccess {}

export interface DeleteChatMessageRequestBody {
  chatMessageId: string;
}

export async function handleDeleteChatMessage({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: DeleteChatMessageRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | DeleteChatMessageFailedReason>,
    DeleteChatMessageSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { chatMessageId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Delete From DB
  //////////////////////////////////////////////////

  const deleteChatMessageResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.deleteChatMessage(
      {
        controller,
        chatMessageId,
        userId: clientUserId,
      },
    );
  if (deleteChatMessageResponse.type === EitherType.failure) {
    return deleteChatMessageResponse;
  }
  const { success: deletedChatMessage } = deleteChatMessageResponse;

  const chatRoomId = deletedChatMessage.chatRoomId;

  //////////////////////////////////////////////////
  // Get List of UserIds In Chat Room
  //////////////////////////////////////////////////

  const getUserIdsJoinedToChatRoomIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getUserIdsJoinedToChatRoomId(
      { controller, chatRoomId },
    );
  if (getUserIdsJoinedToChatRoomIdResponse.type === EitherType.failure) {
    return getUserIdsJoinedToChatRoomIdResponse;
  }
  const { success: userIds } = getUserIdsJoinedToChatRoomIdResponse;

  //////////////////////////////////////////////////
  // Notify User Ids of Deleted Message
  //////////////////////////////////////////////////

  await controller.webSocketService.notifyUserIdsOfDeletedChatMessage({
    userIds,
    deletedChatMessageId: deletedChatMessage.chatMessageId,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
