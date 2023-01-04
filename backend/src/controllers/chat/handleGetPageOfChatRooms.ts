import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../utilities/monads/unwrapListOfResponses";
import { checkAuthentication } from "../auth/utilities";
import { assembleRenderableUsersByIds } from "../user/utilities/assembleRenderableUserById";
import { ChatController } from "./chatController";
import {
  RenderableChatRoomWithJoinedUsers,
  UnrenderableChatRoomWithJoinedUsers,
} from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { UnrenderableUser } from "../user/models";
import { DatabaseService } from "../../services/databaseService";
import { Controller } from "tsoa";

export interface GetPageOfChatRoomsRequestBody {
  cursor?: string;
  pageSize: number;
  query?: string;
}

export interface GetPageOfChatRoomsSuccess {
  chatRooms: RenderableChatRoomWithJoinedUsers[];

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { pageSize, cursor, query } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Unrenderable Chat Rooms
  //    If Query: Matching Query
  // Or If No Query: Joined By Client
  //////////////////////////////////////////////////
  let unrenderableChatRooms: UnrenderableChatRoomWithJoinedUsers[];

  if (!!query) {
    const getUnrenderableChatRoomsMatchingQueryResponse =
      await getUnrenderableChatRoomsMatchingQuery({
        controller,
        query,
        databaseService: controller.databaseService,
        requestorUserId: clientUserId,
      });
    if (getUnrenderableChatRoomsMatchingQueryResponse.type === EitherType.failure) {
      return getUnrenderableChatRoomsMatchingQueryResponse;
    }
    unrenderableChatRooms = getUnrenderableChatRoomsMatchingQueryResponse.success;
  } else {
    //////////////////////////////////////////////////
    // Get the List of Chat Rooms
    //    Ordered by the Last Chat Message Created
    //////////////////////////////////////////////////

    const getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessage(
        { controller, userIds: [clientUserId] },
      );
    if (
      getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse.type ===
      EitherType.failure
    ) {
      return getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse;
    }
    const { success: orderedChatRoomIds } =
      getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse;

    //////////////////////////////////////////////////
    // Get the Users in Each Chat Rooms
    //////////////////////////////////////////////////

    const getChatRoomJoinsByChatRoomIdsResponse =
      await controller.databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomJoinsByChatRoomIds(
        { controller, chatRoomIds: orderedChatRoomIds },
      );
    if (getChatRoomJoinsByChatRoomIdsResponse.type === EitherType.failure) {
      return getChatRoomJoinsByChatRoomIdsResponse;
    }

    const { success: chatRoomJoins } = getChatRoomJoinsByChatRoomIdsResponse;
    const chatRoomIdToChatRoomJoinsMap = new Map();
    chatRoomJoins.forEach((chatRoomJoin) => {
      chatRoomIdToChatRoomJoinsMap.set(chatRoomJoin.chatRoomId, chatRoomJoin);
    });

    unrenderableChatRooms = orderedChatRoomIds.map((chatRoomId) =>
      chatRoomIdToChatRoomJoinsMap.get(chatRoomId),
    );
  }

  //////////////////////////////////////////////////
  // Get List of UserIds in Chat Rooms
  //////////////////////////////////////////////////

  const setOfUserIds: Set<string> = new Set();
  unrenderableChatRooms.forEach(({ memberUserIds }) => {
    memberUserIds.forEach((memberUserId) => {
      setOfUserIds.add(memberUserId);
    });
  });

  //////////////////////////////////////////////////
  // Get Renderable Users in Chat Rooms
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await assembleRenderableUsersByIds({
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
  // Determine which Chat Rooms Have Unread Notifications
  //////////////////////////////////////////////////

  const filterChatRoomIdsToThoseWithUnreadChatMessagesResponse =
    await controller.databaseService.tableNameToServicesMap.chatMessagesTableService.filterChatRoomIdsToThoseWithUnreadChatMessages(
      {
        controller,
        chatRoomIds: unrenderableChatRooms.map(({ chatRoomId }) => chatRoomId),
        userId: clientUserId,
      },
    );
  if (
    filterChatRoomIdsToThoseWithUnreadChatMessagesResponse.type === EitherType.failure
  ) {
    return filterChatRoomIdsToThoseWithUnreadChatMessagesResponse;
  }

  const { success: chatRoomIdsWithUnreadChatMessages } =
    filterChatRoomIdsToThoseWithUnreadChatMessagesResponse;

  //////////////////////////////////////////////////
  // Generate Renderable Chat Rooms
  //////////////////////////////////////////////////
  const mapOfUserIdsToRenderableUsers = new Map(
    renderableUsers.map((renderableUser) => {
      return [renderableUser.userId, renderableUser];
    }),
  );

  const renderableChatRooms: RenderableChatRoomWithJoinedUsers[] =
    unrenderableChatRooms.map(({ memberUserIds, chatRoomId }) => {
      const members = memberUserIds.map(
        (memberUserId) => mapOfUserIdsToRenderableUsers.get(memberUserId)!,
      );

      return {
        hasUnreadMessages: chatRoomIdsWithUnreadChatMessages.includes(chatRoomId),
        chatRoomId,
        members,
      };
    });

  //////////////////////////////////////////////////
  // Generate Page of Results
  //////////////////////////////////////////////////

  const beginningOfPageCursor = cursor ? +cursor : 0;
  const endOfPageCursor = beginningOfPageCursor + pageSize;
  const pageOfRenderableChatRooms = renderableChatRooms.slice(
    beginningOfPageCursor,
    endOfPageCursor,
  );

  const adjustedEndOfPageCursor =
    renderableChatRooms.length > endOfPageCursor ? endOfPageCursor.toString() : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    chatRooms: pageOfRenderableChatRooms,
    previousPageCursor: cursor,
    nextPageCursor: adjustedEndOfPageCursor,
  });
}

async function getUnrenderableChatRoomsMatchingQuery({
  controller,
  query,
  databaseService,
  requestorUserId,
}: {
  controller: Controller;
  query: string;
  databaseService: DatabaseService;
  requestorUserId: string;
}): Promise<InternalServiceResponse<string, UnrenderableChatRoomWithJoinedUsers[]>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const usernameSubstrings = query.split(" ");

  //////////////////////////////////////////////////
  // Select Users Matching Query
  //////////////////////////////////////////////////

  const selectUsersByUsernameMatchingSubstringResponses = await BluebirdPromise.map(
    usernameSubstrings,
    async (usernameSubstring) => {
      return await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
        { controller, usernameSubstring },
      );
    },
  );

  const arrayOfMatchedUsers = unwrapListOfEitherResponses({
    eitherResponses: selectUsersByUsernameMatchingSubstringResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
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

  //////////////////////////////////////////////////
  // Get the List of Chat Rooms
  //    Ordered by the Last Chat Message Created
  //////////////////////////////////////////////////

  const getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse =
    await databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessage(
      { controller, userIds: [requestorUserId, ...matchedUserIds] },
    );
  if (
    getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse.type ===
    EitherType.failure
  ) {
    return getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse;
  }
  const { success: orderedChatRoomIds } =
    getChatRoomsIdsJoinedByUserIdsOrderedByLatestChatMessageResponse;

  //////////////////////////////////////////////////
  // Get the Users in Each Chat Rooms
  //////////////////////////////////////////////////

  const getChatRoomJoinsByChatRoomIdsResponse =
    await databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomJoinsByChatRoomIds(
      { controller, chatRoomIds: orderedChatRoomIds },
    );
  if (getChatRoomJoinsByChatRoomIdsResponse.type === EitherType.failure) {
    return getChatRoomJoinsByChatRoomIdsResponse;
  }

  const { success: chatRoomJoins } = getChatRoomJoinsByChatRoomIdsResponse;
  const chatRoomIdToChatRoomJoinsMap = new Map();
  chatRoomJoins.forEach((chatRoomJoin) => {
    chatRoomIdToChatRoomJoinsMap.set(chatRoomJoin.chatRoomId, chatRoomJoin);
  });

  const getChatRoomsJoinedByUserIdsResponse = orderedChatRoomIds.map((chatRoomId) =>
    chatRoomIdToChatRoomJoinsMap.get(chatRoomId),
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(getChatRoomsJoinedByUserIdsResponse);
}
