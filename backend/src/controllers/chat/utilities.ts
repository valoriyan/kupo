import { DatabaseService } from "../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";

export async function getCountOfUnreadChatRooms({
  controller,
  databaseService,
  userId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  userId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
  // GET LIST OF CHAT ROOMS JOINED BY USER, WITH MESSAGES CREATED AFTER TIMESTAMP,

  // GET LIST OF CHAT ROOMS JOINED BY USER
  // ATTACH THE TIMESTAMPS OF THE LAST MESSAGES FOR EACH CHAT ROOM
  // GET LAST READING TIMESTAMPS FOR EACH CHAT ROOM
  // COUNT

  const getChatRoomsJoinedByUserIdsResponse =
    await databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getChatRoomsJoinedByUserIds(
      {
        controller,
        userIds: [userId],
      },
    );
  if (getChatRoomsJoinedByUserIdsResponse.type === EitherType.failure) {
    return getChatRoomsJoinedByUserIdsResponse;
  }
  const { success: unrenderableChatRoomWithJoinedUsers } =
    getChatRoomsJoinedByUserIdsResponse;
  const chatRoomIdsJoinedByUser = unrenderableChatRoomWithJoinedUsers.map(
    ({ chatRoomId }) => chatRoomId,
  );

  const getChatRoomReadRecordsForUserIdResponse =
    await databaseService.tableNameToServicesMap.chatRoomReadRecordsTableService.getChatRoomReadRecordsForUserId(
      {
        controller,
        userId,
      },
    );
  if (getChatRoomReadRecordsForUserIdResponse.type === EitherType.failure) {
    return getChatRoomReadRecordsForUserIdResponse;
  }
  const { success: dbChatRoomReadRecords } = getChatRoomReadRecordsForUserIdResponse;

  const chatRoomIdToTimestampLastReadByUserMap = new Map(
    dbChatRoomReadRecords.map(({ chat_room_id, timestamp_last_read_by_user }) => [
      chat_room_id,
      timestamp_last_read_by_user,
    ]),
  );
  chatRoomIdsJoinedByUser.forEach((chatRoomIdJoinedByUser) => {
    if (!chatRoomIdToTimestampLastReadByUserMap.has(chatRoomIdJoinedByUser)) {
      chatRoomIdToTimestampLastReadByUserMap.set(chatRoomIdJoinedByUser, 0);
    }
  });

  const chatRoomsIdsWithTimestamps: {
    chatRoomId: string;
    timestamp: number;
  }[] = [...chatRoomIdToTimestampLastReadByUserMap.entries()].map(
    ([chatRoomId, timestamp]) => ({ chatRoomId, timestamp }),
  );

  const filterChatRoomIdsToThoseWithNewMessagesAfterTimestampsResponse =
    await databaseService.tableNameToServicesMap.chatMessagesTableService.filterChatRoomIdsToThoseWithNewMessagesAfterTimestamps(
      {
        controller,
        chatRoomsIdsWithTimestamps,
      },
    );
  if (
    filterChatRoomIdsToThoseWithNewMessagesAfterTimestampsResponse.type ===
    EitherType.failure
  ) {
    return filterChatRoomIdsToThoseWithNewMessagesAfterTimestampsResponse;
  }
  const { success: chatRoomsUnreadByUser } =
    filterChatRoomIdsToThoseWithNewMessagesAfterTimestampsResponse;

  return Success(chatRoomsUnreadByUser.length);
}
