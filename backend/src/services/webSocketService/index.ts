import { Server } from "socket.io";
import { Server as httpServer } from "http";
import { validateTokenAndGetUserId } from "../../controllers/auth/utilities";
import { notifyUserIdsOfNewChatMessage } from "./chat/notifyUserIdsOfNewChatMessage";
import { singleton } from "tsyringe";
import { generatePrivateUserWebSocketRoomName } from "./utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { NewChatMessageNotification } from "../../controllers/chat/models";
import { notifyUserIdsOfDeletedChatMessage } from "./chat/notifyUserIdsOfDeletedChatMessage";
import { getEnvironmentVariable } from "../../utilities";
import { NewChatNotification } from "./chat/models";
import { NOTIFICATION_EVENTS } from "./eventsConfig";
import { UserNotificationsWebsocketService } from "./userNotifications";

@singleton()
export class WebSocketService {
  static io: Server;

  public userNotificationsWebsocketService: UserNotificationsWebsocketService =
    new UserNotificationsWebsocketService(WebSocketService.io);

  static async start(httpServer: httpServer): Promise<void> {
    const origin = getEnvironmentVariable("FRONTEND_BASE_URL", "http://localhost:3000");
    console.log(`origin: ${origin}`);

    const io = new Server(httpServer, {
      cors: {
        origin,
      },
    });

    WebSocketService.io = io;

    io.on("connection", (socket) => {
      const accessToken = socket.handshake.auth["accessToken"];

      try {
        const userId = validateTokenAndGetUserId({
          token: accessToken,
          jwtPrivateKey: getEnvironmentVariable("JWT_PRIVATE_KEY"),
        });

        const rooms = [generatePrivateUserWebSocketRoomName({ userId })];
        socket.join(rooms);

        // socket.on(NEW_CHAT_MESSAGE_EVENT_NAME, (incomingMessage: ChatMessage) => {
        //   console.log("MESSAGE CAME IN!");
        //   console.log(incomingMessage);
        // });
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }

  public async notifyOfNewPublishedItem({
    recipientUserId,
    username,
    previewTemporaryUrl,
  }: {
    recipientUserId: string;
    username: string;
    previewTemporaryUrl: string;
  }): Promise<void> {
    const message: NewChatNotification = {
      previewTemporaryUrl,
      username,
    };

    const roomName = generatePrivateUserWebSocketRoomName({ userId: recipientUserId });

    WebSocketService.io
      .to([roomName])
      .emit(NOTIFICATION_EVENTS.NEW_PUBLISHED_ITEM, message);
  }

  public async notifyUserIdsOfNewChatMessage({
    newChatMessageNotification,
    userIds,
  }: {
    newChatMessageNotification: NewChatMessageNotification;
    userIds: string[];
  }) {
    await BluebirdPromise.map(userIds, async (userId) => {
      await notifyUserIdsOfNewChatMessage({
        io: WebSocketService.io,
        newChatMessageNotification: newChatMessageNotification,
        userId,
      });
    });
  }

  public async notifyUserIdsOfDeletedChatMessage({
    deletedChatMessageId,
    userIds,
  }: {
    deletedChatMessageId: string;
    userIds: string[];
  }) {
    await BluebirdPromise.map(userIds, async (userId) => {
      await notifyUserIdsOfDeletedChatMessage({
        io: WebSocketService.io,
        deletedChatMessageId,
        userId,
      });
    });
  }
}
