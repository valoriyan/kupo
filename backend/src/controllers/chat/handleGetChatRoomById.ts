import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromPartsByUserIds } from "../user/utilities";
import { ChatController } from "./chatController";
import { RenderableChatRoomWithJoinedUsers } from "./models";

export interface GetChatRoomByIdRequestBody {
  chatRoomId: string;
}

export interface GetChatRoomByIdSuccess {
  chatRoom: RenderableChatRoomWithJoinedUsers;
}

export enum GetChatRoomByIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetChatRoomById({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetChatRoomByIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetChatRoomByIdFailedReason>,
    GetChatRoomByIdSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { chatRoomId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Chat Rooms Joins
  //////////////////////////////////////////////////

  const getChatRoomByIdResponse =
    await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getUnrenderableChatRoomWithJoinedUsersByChatRoomId(
      { controller, chatRoomId },
    );
  if (getChatRoomByIdResponse.type === EitherType.failure) {
    return getChatRoomByIdResponse;
  }
  const { success: unrenderableChatRoom } = getChatRoomByIdResponse;

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRoom.memberUserIds.forEach((memberUserId) => {
    setOfUserIds.add(memberUserId);
  });

  //////////////////////////////////////////////////
  // Get Renderable Users
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await constructRenderableUsersFromPartsByUserIds({
      controller,
      requestorUserId: clientUserId,
      userIds: [...setOfUserIds],
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });
  if (constructRenderableUsersFromPartsByUserIdsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsByUserIdsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsByUserIdsResponse;

  //////////////////////////////////////////////////
  // Put Together Renderable Chat Room
  //////////////////////////////////////////////////

  const mapOfUserIdsToRenderableUsers = new Map(
    renderableUsers.map((renderableUser) => {
      return [renderableUser.userId, renderableUser];
    }),
  );

  const chatRoomMembers = unrenderableChatRoom.memberUserIds.map(
    (memberUserId) => mapOfUserIdsToRenderableUsers.get(memberUserId)!,
  );

  const renderableChatRoom: RenderableChatRoomWithJoinedUsers = {
    chatRoomId,
    members: chatRoomMembers,
  };

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    chatRoom: renderableChatRoom,
  });
}
