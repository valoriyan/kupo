import { Server } from "socket.io";
import { NewChatMessageNotification } from "../../../controllers/chat/models";
import { NOTIFICATION_EVENTS } from "../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

export async function notifyUserIdsOfNewChatMessage({
  io,
  newChatMessageNotification,
  userId,
}: {
  io: Server;
  newChatMessageNotification: NewChatMessageNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_CHAT_MESSAGE,
    newChatMessageNotification,
  );
}
