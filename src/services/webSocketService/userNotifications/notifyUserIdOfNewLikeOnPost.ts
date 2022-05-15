import { Server } from "socket.io";
import { RenderableNewLikeOnPostNotification } from "../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

export async function notifyUserIdOfNewLikeOnPost({
  io,
  renderableNewLikeOnPostNotification,
  userId,
}: {
  io: Server;
  renderableNewLikeOnPostNotification: RenderableNewLikeOnPostNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });
  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_LIKE_ON_POST,
    renderableNewLikeOnPostNotification,
  );
}
