import express from "express";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
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
    ErrorReasonTypes<string | GetPageOfChatRoomsFailedReason>,
    GetPageOfChatRoomsSuccess
  >
> {
  const { pageSize, cursor, query } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  let unrenderableChatRooms: UnrenderableChatRoomPreview[];

  if (!!query) {
    const usernameSubstrings = query.split(" ");

    const selectUsersByUsernameMatchingSubstringResponses = await BluebirdPromise.map(
      usernameSubstrings,
      async (usernameSubstring) => {
        return await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
          { controller, usernameSubstring },
        );
      },
    );

    const arrayOfMatchedUsers = collectMappedResponses({
      mappedResponses: selectUsersByUsernameMatchingSubstringResponses,
    });
    if (arrayOfMatchedUsers.type === EitherType.failure) {
      return arrayOfMatchedUsers;
    }

    const matchedUsers = arrayOfMatchedUsers.success.reduce(
      (memo: UnrenderableUser[], matchedUsers: UnrenderableUser[]) =>
        memo.concat(...matchedUsers),
      [],
    );

    const matchedUserIds = matchedUsers.map(({ userId }) => userId);

    const getChatRoomsJoinedByUserIdsResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomsJoinedByUserIds(
        { controller, userIds: [clientUserId, ...matchedUserIds] },
      );
    if (getChatRoomsJoinedByUserIdsResponse.type === EitherType.failure) {
      return getChatRoomsJoinedByUserIdsResponse;
    }
    unrenderableChatRooms = getChatRoomsJoinedByUserIdsResponse.success;
  } else {
    const getChatRoomsJoinedByUserIdsResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomsJoinedByUserIds(
        { controller, userIds: [clientUserId] },
      );
    if (getChatRoomsJoinedByUserIdsResponse.type === EitherType.failure) {
      return getChatRoomsJoinedByUserIdsResponse;
    }
    unrenderableChatRooms = getChatRoomsJoinedByUserIdsResponse.success;
  }

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRooms.forEach(({ memberUserIds }) => {
    memberUserIds.forEach((memberUserId) => {
      setOfUserIds.add(memberUserId);
    });
  });

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

  return Success({
    chatRooms: pageOfRenderableChatRooms,
    previousPageCursor: cursor,
    nextPageCursor: adjustedEndOfPageCursor,
  });
}
