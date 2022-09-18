import { Server } from "socket.io";
import { UnrenderableCanceledNewUserFollowRequestNotification } from "../../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledNewUserFollowRequest({
  io,
  unrenderableCanceledNewUserFollowRequestNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledNewUserFollowRequestNotification: UnrenderableCanceledNewUserFollowRequestNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_NEW_USER_FOLLOW_REQUEST,
    unrenderableCanceledNewUserFollowRequestNotification,
  );
}
