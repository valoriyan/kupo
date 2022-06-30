import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { constructRenderableUsersFromPartsByUserIds } from "../user/utilities";
import { ChatController } from "./chatController";
import { RenderableChatRoomPreview, UnrenderableChatRoomPreview } from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { UnrenderableUser } from "../user/models";

export interface GetPageOfChatRoomsRequestBody {
  cursor?: string;
  pageSize: number;
  query?: string;
}

export interface GetPageOfChatRoomsSuccess {
  chatRooms: RenderableChatRoomPreview[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPageOfChatRoomsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfChatRoomsFailed {
  reason: GetPageOfChatRoomsFailedReason;
}

export async function handleGetPageOfChatRooms({
  controller,
  request,
  requestBody,
}: {
  controller: ChatController;
  request: express.Request;
  requestBody: GetPageOfChatRoomsRequestBody;
}): Promise<SecuredHTTPResponse<GetPageOfChatRoomsFailed, GetPageOfChatRoomsSuccess>> {
  const { pageSize, cursor, query } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  let unrenderableChatRooms: UnrenderableChatRoomPreview[];

  if (!!query) {
    const usernameSubstrings = query.split(" ");

    const matchedUsers = await BluebirdPromise.map(
      usernameSubstrings,
      async (usernameSubstring) => {
        return await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
          { usernameSubstring },
        );
      },
    ).reduce(
      (memo: UnrenderableUser[], matchedUsers: UnrenderableUser[]) =>
        memo.concat(...matchedUsers),
      [],
    );

    const matchedUserIds = matchedUsers.map(({ userId }) => userId);

    unrenderableChatRooms =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomsJoinedByUserIds(
        { userIds: [clientUserId, ...matchedUserIds] },
      );
  } else {
    unrenderableChatRooms =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomsJoinedByUserIds(
        { userIds: [clientUserId] },
      );
  }

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRooms.forEach(({ memberUserIds }) => {
    memberUserIds.forEach((memberUserId) => {
      setOfUserIds.add(memberUserId);
    });
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

  const renderableChatRooms: RenderableChatRoomPreview[] = unrenderableChatRooms.map(
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

  const adjustedEndOfPageCursor =
    renderableChatRooms.length > endOfPageCursor ? endOfPageCursor.toString() : undefined;

  return {
    success: {
      chatRooms: pageOfRenderableChatRooms,
      previousPageCursor: cursor,
      nextPageCursor: adjustedEndOfPageCursor,
    },
  };
}
