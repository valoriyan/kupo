import { Server } from "socket.io";
import { UnrenderableCanceledAcceptedUserFollowRequestNotification } from "../../../../controllers/notification/models/unrenderableCanceledUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfCanceledAcceptedUserFollowRequest({
  io,
  unrenderableCanceledAcceptedUserFollowRequestNotification,
  userId,
}: {
  io: Server;
  unrenderableCanceledAcceptedUserFollowRequestNotification: UnrenderableCanceledAcceptedUserFollowRequestNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.CANCELED_ACCEPTED_USER_FOLLOW_REQUEST,
    unrenderableCanceledAcceptedUserFollowRequestNotification,
  );
}
