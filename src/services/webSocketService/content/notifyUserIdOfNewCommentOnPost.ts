import { Server } from "socket.io";
import { RenderableNewCommentOnPostNotification } from "../../../controllers/notification/models";
import { NOTIFICATION_EVENTS } from "../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

export async function notifyUserIdOfNewCommentOnPost({
  io,
  renderableNewCommentOnPostNotification,
  userId,
}: {
  io: Server;
  renderableNewCommentOnPostNotification: RenderableNewCommentOnPostNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.NEW_COMMENT_ON_POST,
    renderableNewCommentOnPostNotification,
  );
}
