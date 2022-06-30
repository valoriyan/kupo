import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromPartsByUserIds } from "../user/utilities";
import { ChatController } from "./chatController";
import { RenderableChatRoomPreview } from "./models";

export interface GetChatRoomByIdRequestBody {
  chatRoomId: string;
}

export interface GetChatRoomByIdSuccess {
  chatRoom: RenderableChatRoomPreview;
}

export enum GetChatRoomByIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetChatRoomByIdFailed {
  reason: GetChatRoomByIdFailedReason;
}

export async function handleGetChatRoomById({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetChatRoomByIdRequestBody;
}): Promise<SecuredHTTPResponse<GetChatRoomByIdFailed, GetChatRoomByIdSuccess>> {
  const { chatRoomId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableChatRoom =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomById(
      { chatRoomId },
    );

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRoom.memberUserIds.forEach((memberUserId) => {
    setOfUserIds.add(memberUserId);
  });

  const renderableUsers = await constructRenderableUsersFromPartsByUserIds({
    clientUserId,
    userIds: [...setOfUserIds],
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const mapOfUserIdsToRenderableUsers = new Map(
    renderableUsers.map((renderableUser) => {
      return [renderableUser.userId, renderableUser];
    }),
  );

  const chatRoomMembers = unrenderableChatRoom.memberUserIds.map(
    (memberUserId) => mapOfUserIdsToRenderableUsers.get(memberUserId)!,
  );

  const renderableChatRoom = {
    chatRoomId,
    members: chatRoomMembers,
  };

  return {
    success: {
      chatRoom: renderableChatRoom,
    },
  };
}
