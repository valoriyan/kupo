import { Server } from "socket.io";
import { UnrenderableCanceledNewLikeOnPublishedItemNotification } from "../../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledNewLikeOnPost({
  io,
  unrenderableCanceledNewLikeOnPostNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_NEW_LIKE_ON_PUBLISHED_ITEM,
    unrenderableCanceledNewLikeOnPostNotification,
  );
}
