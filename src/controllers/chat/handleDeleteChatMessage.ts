import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";

export enum DeleteChatMessageFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface DeleteChatMessageFailed {
  reason: DeleteChatMessageFailedReason;
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
    DeleteChatMessageFailed,
    DeleteChatMessageSuccess
  >
> {
  const { chatMessageId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const deletedChatMessage =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.deleteChatMessage(
      {
        chatMessageId,
        userId: clientUserId,
      },
    );

  const chatRoomId = deletedChatMessage.chatRoomId;

  const userIds =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getUserIdsJoinedToChatRoomId(
      { chatRoomId },
    );

  await controller.webSocketService.notifyUserIdsOfDeletedChatMessage({
    userIds,
    deletedChatMessageId: deletedChatMessage.chatMessageId,
  });

  return { success: {} };
}
