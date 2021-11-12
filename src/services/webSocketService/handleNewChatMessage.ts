import { Server } from "socket.io";
import { ChatMessage, NEW_CHAT_MESSAGE_EVENT_NAME } from "./eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

export async function handleNewChatMessage({
  io,
  incomingMessage,
  incomingUserId,
  sendAcknowledgement,
}: {
  io: Server;
  incomingMessage: ChatMessage;
  incomingUserId: string;
  sendAcknowledgement: ({ received }: { received: boolean }) => void;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({userId: incomingUserId});

  sendAcknowledgement({ received: true });

  io.to([roomName]).emit(NEW_CHAT_MESSAGE_EVENT_NAME, {
    message: incomingMessage.message,
  });
}
