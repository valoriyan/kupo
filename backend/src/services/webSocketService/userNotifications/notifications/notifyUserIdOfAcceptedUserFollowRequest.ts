import { Server } from "socket.io";
import { RenderableAcceptedUserFollowRequestNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfAcceptedUserFollowRequest({
  io,
  renderableAcceptedUserFollowRequestNotification,
  userId,
}: {
  io: Server;
  renderableAcceptedUserFollowRequestNotification: RenderableAcceptedUserFollowRequestNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.ACCEPTED_USER_FOLLOW_REQUEST,
    renderableAcceptedUserFollowRequestNotification,
  );
}
