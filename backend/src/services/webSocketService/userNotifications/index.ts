import { Server } from "socket.io";
import { BaseUserNotification } from "../../../controllers/notification/models";
import { generatePrivateUserWebSocketRoomName } from "../utilities";

export class UserNotificationsWebsocketService {
  constructor(public websocketIO: Server) {}

  public async notifyUserIdOfUserNotification<T extends BaseUserNotification>({
    notification,
    userId,
  }: {
    notification: T;
    userId: string;
  }) {
    const roomName = generatePrivateUserWebSocketRoomName({ userId });

    this.websocketIO.to([roomName]).emit(notification.type, notification);
  }
}
