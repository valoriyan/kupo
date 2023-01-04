import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { userIds } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Check that Request Includes Client User Id
  //////////////////////////////////////////////////

  if (!userIds.includes(clientUserId)) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: DoesChatRoomExistWithUserIdsFailedReason.IllegalAccess,
      error: "Illegal access at handleDoesChatRoomExistWithUserIds",
      additionalErrorInformation: "Illegal access at handleDoesChatRoomExistWithUserIds",
    });
  }

  //////////////////////////////////////////////////
  // Get Chat Rooms That Contain User Ids And Only User Ids
  //////////////////////////////////////////////////

  const getChatRoomIdWithUserIdMembersExclusiveResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomIdWithJoinedUserIdMembersExclusive(
      { controller, userIds: new Set(userIds) },
    );
  if (getChatRoomIdWithUserIdMembersExclusiveResponse.type === EitherType.failure) {
    return getChatRoomIdWithUserIdMembersExclusiveResponse;
  }
  const { success: chatRoomId } = getChatRoomIdWithUserIdMembersExclusiveResponse;

  const doesChatRoomExist = !!chatRoomId;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    doesChatRoomExist,
    chatRoomId: doesChatRoomExist ? chatRoomId : undefined,
  });
}
