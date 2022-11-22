import { Server } from "socket.io";
import { RenderableNewTagInPublishedItemCaptionNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfNewTagInPublishedItemCaption({
  io,
  renderableNewTagInPublishedItemCaptionNotification,
  userId,
}: {
  io: Server;
  renderableNewTagInPublishedItemCaptionNotification: RenderableNewTagInPublishedItemCaptionNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_CAPTION,
    renderableNewTagInPublishedItemCaptionNotification,
  );
}
