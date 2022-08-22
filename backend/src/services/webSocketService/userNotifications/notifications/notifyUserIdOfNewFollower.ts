import { Server } from "socket.io";
import { RenderableNewFollowerNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewFollower({
  io,
  renderableNewFollowerNotification,
  userId,
}: {
  io: Server;
  renderableNewFollowerNotification: RenderableNewFollowerNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_FOLLOWER,
    renderableNewFollowerNotification,
  );
}
