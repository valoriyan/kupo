import { DatabaseService } from "../../services/databaseService";
import { Controller } from "tsoa";
import { ErrorReasonTypes, InternalServiceResponse } from "../../utilities/monads";

export async function getCountOfUnreadChatRooms({
  controller,
  databaseService,
  userId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  userId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
  return await databaseService.tableNameToServicesMap.chatRoomJoinsTableService.getCountOfUnreadChatRoomsByUserId(
    {
      controller,
      userId,
    },
  );
}
