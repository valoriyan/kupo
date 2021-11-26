import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { areSetsEqual } from "../../utilities/checkSetEquality";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";

export interface DoesChatRoomExistWithUserIdsRequestBody {
  userIds: string[];
}

export interface SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse {
  doesChatRoomExist: boolean;
  chatRoomId?: string;
}

export enum FailedtoDetermineIfChatRoomExistsWithUserIdsReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export interface FailedtoDetermineIfChatRoomExistsWithUserIds {
  reason: FailedtoDetermineIfChatRoomExistsWithUserIdsReason;
}

export async function handleDoesChatRoomExistWithUserIds({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: DoesChatRoomExistWithUserIdsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedtoDetermineIfChatRoomExistsWithUserIds,
    SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse
  >
> {
  const { userIds } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  if (!userIds.includes(clientUserId)) {
    return {
      error: { reason: FailedtoDetermineIfChatRoomExistsWithUserIdsReason.IllegalAccess },
    };
  }

  const chatRoomId =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomIdWithUserIdMembersExclusive(
      { userIds },
    );

  let doesChatRoomExist = false;
  if (chatRoomId) {
    const userIdsInChatRoom =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getUserIdsJoinedToChatRoomId(
        { chatRoomId },
      );
    doesChatRoomExist = areSetsEqual(new Set(userIdsInChatRoom), new Set(userIds));
  }

  return {
    success: {
      doesChatRoomExist,
      chatRoomId: doesChatRoomExist ? chatRoomId : undefined,
    },
  };
}
