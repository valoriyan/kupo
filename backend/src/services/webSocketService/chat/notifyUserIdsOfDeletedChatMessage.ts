import { Server } from "socket.io";
import { NOTIFICATION_EVENTS } from "../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

export async function notifyUserIdsOfDeletedChatMessage({
  io,
  deletedChatMessageId,
  userId,
}: {
  io: Server;
  deletedChatMessageId: string;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(NOTIFICATION_EVENTS.DELETED_CHAT_MESSAGE, deletedChatMessageId);
}
