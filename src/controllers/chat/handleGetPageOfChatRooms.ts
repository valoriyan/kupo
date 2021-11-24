import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromParts } from "../user/utilities";
import { ChatController } from "./chatController";
import { RenderableChatRoom } from "./models";

export interface GetPageOfChatRoomsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface SuccessfulGetPageOfChatRoomsResponse {
  chatRooms: RenderableChatRoom[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum FailedtoGetPageOfChatRoomsResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedtoGetPageOfChatRoomsResponse {
  reason: FailedtoGetPageOfChatRoomsResponseReason;
}

export async function handleGetPageOfChatRooms({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetPageOfChatRoomsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedtoGetPageOfChatRoomsResponse,
    SuccessfulGetPageOfChatRoomsResponse
  >
> {
  const { pageSize, cursor } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const unrenderableChatRooms =
    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomsJoinedByUserId(
      { userId: clientUserId },
    );

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRooms.forEach(({ memberUserIds }) => {
    memberUserIds.forEach((memberUserId) => {
      setOfUserIds.add(memberUserId);
    });
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

  const renderableChatRooms: RenderableChatRoom[] = unrenderableChatRooms.map(
    ({ memberUserIds, chatRoomId }) => {
      const members = memberUserIds.map(
        (memberUserId) => mapOfUserIdsToRenderableUsers.get(memberUserId)!,
      );

      return {
        chatRoomId,
        members,
      };
    },
  );

  const beginningOfPageCursor = cursor ? +cursor : 0;
  const endOfPageCursor = beginningOfPageCursor + pageSize;
  const pageOfRenderableChatRooms = renderableChatRooms.slice(
    beginningOfPageCursor,
    endOfPageCursor,
  );

  const adjustedEndOfPageCursor = renderableChatRooms.length > endOfPageCursor ?
    endOfPageCursor.toString() : 
    undefined;


  return {
    success: {
      chatRooms: pageOfRenderableChatRooms,
      previousPageCursor: cursor,
      nextPageCursor: adjustedEndOfPageCursor,
    },
  };
}
