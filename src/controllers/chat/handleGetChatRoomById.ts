import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromParts } from "../user/utilities";
import { ChatController } from "./chatController";
import { RenderableChatRoomPreview } from "./models";

export interface GetChatRoomByIdRequestBody {
  chatRoomId: string;
}

export interface SuccessfullyGotChatRoomByIdResponse {
  chatRoom: RenderableChatRoomPreview;
}

export enum FailedtoGetChatRoomByIdResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetChatRoomByIdResponse {
  reason: FailedtoGetChatRoomByIdResponseReason;
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
  FailedtoGetChatRoomByIdResponse,
    SuccessfullyGotChatRoomByIdResponse
  >
> {
  const { chatRoomId } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableChatRoom =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomById(
      { chatRoomId },
    );

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRoom.memberUserIds.forEach((memberUserId) => {
    setOfUserIds.add(memberUserId);
  });
  
  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      {
        userIds: [...setOfUserIds],
      },
    );

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
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
  }


  return {
    success: {
      chatRoom: renderableChatRoom,
    },
  };
}
