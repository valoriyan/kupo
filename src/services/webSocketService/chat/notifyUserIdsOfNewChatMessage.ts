import { Server } from "socket.io";
import { RenderableChatMessage } from "../../../controllers/chat/models";
import { EVENT_NAMES } from "../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

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

  io.to([roomName]).emit(EVENT_NAMES.NEW_CHAT_MESSAGE, chatMessage);
}
