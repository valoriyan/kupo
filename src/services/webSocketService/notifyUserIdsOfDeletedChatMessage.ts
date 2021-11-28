import { Server } from "socket.io";
import { DELETED_CHAT_MESSAGE_EVENT_NAME } from "./eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

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

  io.to([roomName]).emit(DELETED_CHAT_MESSAGE_EVENT_NAME, deletedChatMessageId);
}
