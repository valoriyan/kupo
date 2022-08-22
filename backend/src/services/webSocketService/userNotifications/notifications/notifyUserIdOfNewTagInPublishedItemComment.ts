import { Server } from "socket.io";
import { RenderableNewTagInPublishedItemCommentNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewTagInPublishedItemComment({
  io,
  renderableNewTagInPublishedItemCommentNotification,
  userId,
}: {
  io: Server;
  renderableNewTagInPublishedItemCommentNotification: RenderableNewTagInPublishedItemCommentNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
    renderableNewTagInPublishedItemCommentNotification,
  );
}
