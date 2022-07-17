import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { areSetsEqual } from "../../utilities/checkSetEquality";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";

export interface DoesChatRoomExistWithUserIdsRequestBody {
  userIds: string[];
}

export interface DoesChatRoomExistWithUserIdsSuccess {
  doesChatRoomExist: boolean;
  chatRoomId?: string;
}

export enum DoesChatRoomExistWithUserIdsFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
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
    ErrorReasonTypes<string | DoesChatRoomExistWithUserIdsFailedReason>,
    DoesChatRoomExistWithUserIdsSuccess
  >
> {
  const { userIds } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  if (!userIds.includes(clientUserId)) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: DoesChatRoomExistWithUserIdsFailedReason.IllegalAccess,
      error: "Illegal access at handleDoesChatRoomExistWithUserIds",
      additionalErrorInformation: "Illegal access at handleDoesChatRoomExistWithUserIds",
    });
  }

  const getChatRoomIdWithUserIdMembersExclusiveResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomIdWithUserIdMembersExclusive(
      { controller, userIds },
    );
  if (getChatRoomIdWithUserIdMembersExclusiveResponse.type === EitherType.failure) {
    return getChatRoomIdWithUserIdMembersExclusiveResponse;
  }
  const { success: chatRoomId } = getChatRoomIdWithUserIdMembersExclusiveResponse;

  let doesChatRoomExist = false;
  if (chatRoomId) {
    const getUserIdsJoinedToChatRoomIdResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getUserIdsJoinedToChatRoomId(
        { controller, chatRoomId },
      );
    if (getUserIdsJoinedToChatRoomIdResponse.type === EitherType.failure) {
      return getUserIdsJoinedToChatRoomIdResponse;
    }
    const { success: userIdsInChatRoom } = getUserIdsJoinedToChatRoomIdResponse;

    doesChatRoomExist = areSetsEqual(new Set(userIdsInChatRoom), new Set(userIds));
  }

  return Success({
    doesChatRoomExist,
    chatRoomId: doesChatRoomExist ? chatRoomId : undefined,
  });
}
