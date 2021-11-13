import { Server } from "socket.io";
import { ChatMessage, NEW_CHAT_MESSAGE_EVENT_NAME } from "./eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

export async function handleNewChatMessage({
  io,
  incomingMessage,
  incomingUserId,
}: {
  io: Server;
  incomingMessage: ChatMessage;
  incomingUserId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId: incomingUserId });

  io.to([roomName]).emit(NEW_CHAT_MESSAGE_EVENT_NAME, {
    message: incomingMessage.message,
  });
}
