import { Server } from "socket.io";
import { RenderableChatMessage } from "src/controllers/chat/models";
import { NEW_CHAT_MESSAGE_EVENT_NAME } from "./eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

export async function notifyUserIdsOfNewChatMessage({
  io,
  chatMessage,
  userId,
}: {
  io: Server;
  chatMessage: RenderableChatMessage;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(NEW_CHAT_MESSAGE_EVENT_NAME, chatMessage);
}
