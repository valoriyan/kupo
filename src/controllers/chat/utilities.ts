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
  const getCountOfChatRoomsJoinedByUserIdResponse =
    await databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getCountOfChatRoomsJoinedByUserId(
      {
        controller,
        userId,
      },
    );
  if (getCountOfChatRoomsJoinedByUserIdResponse.type === EitherType.failure) {
    return getCountOfChatRoomsJoinedByUserIdResponse;
  }
  const { success: countOfChatRoomsJoinedByUser } =
    getCountOfChatRoomsJoinedByUserIdResponse;

  const getCountOfChatRoomsReadByUserIdBeforeTimestampResponse =
    await databaseService.tableNameToServicesMap.chatRoomReadRecordsTableService.getCountOfChatRoomsReadByUserIdBeforeTimestamp(
      {
        controller,
        userId,
        timestamp: Date.now(),
      },
    );
  if (
    getCountOfChatRoomsReadByUserIdBeforeTimestampResponse.type === EitherType.failure
  ) {
    return getCountOfChatRoomsReadByUserIdBeforeTimestampResponse;
  }
  const { success: countOfReadChatRooms } =
    getCountOfChatRoomsReadByUserIdBeforeTimestampResponse;

  return Success(countOfChatRoomsJoinedByUser - countOfReadChatRooms);
}
