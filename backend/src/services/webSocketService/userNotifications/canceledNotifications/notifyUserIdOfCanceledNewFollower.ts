import { Server } from "socket.io";
import { UnrenderableCanceledNewFollowerNotification } from "../../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledNewFollower({
  io,
  unrenderableCanceledNewFollowerNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_NEW_FOLLOWER,
    unrenderableCanceledNewFollowerNotification,
  );
}
