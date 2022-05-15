import { Server } from "socket.io";
import { UnrenderableCanceledCommentOnPostNotification } from "src/controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledNewCommentOnPost({
  io,
  unrenderableCanceledCommentOnPostNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPostNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_NEW_COMMENT_ON_POST,
    unrenderableCanceledCommentOnPostNotification,
  );
}
