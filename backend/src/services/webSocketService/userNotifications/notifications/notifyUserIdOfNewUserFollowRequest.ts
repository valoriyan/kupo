import { Server } from "socket.io";
import { RenderableNewUserFollowRequestNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewUserFollowRequest({
  io,
  renderableNewUserFollowRequestNotification,
  userId,
}: {
  io: Server;
  renderableNewUserFollowRequestNotification: RenderableNewUserFollowRequestNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_FOLLOWER,
    renderableNewUserFollowRequestNotification,
  );
}
