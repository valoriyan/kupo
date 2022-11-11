import { Server } from "socket.io";
import { RenderableNewLikeOnPublishedItemNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewLikeOnPublishedItem({
  io,
  renderableNewLikeOnPostNotification,
  userId,
}: {
  io: Server;
  renderableNewLikeOnPostNotification: RenderableNewLikeOnPublishedItemNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });
  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_LIKE_ON_PUBLISHED_ITEM,
    renderableNewLikeOnPostNotification,
  );
}
