import { Server } from "socket.io";
import { RenderableNewCommentOnPublishedItemNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewCommentOnPost({
  io,
  renderableNewCommentOnPostNotification,
  userId,
}: {
  io: Server;
  renderableNewCommentOnPostNotification: RenderableNewCommentOnPublishedItemNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_COMMENT_ON_PUBLISHED_ITEM,
    renderableNewCommentOnPostNotification,
  );
}
