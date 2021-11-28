import { Server } from "socket.io";
import { Server as httpServer } from "http";
import { validateTokenAndGetUserId } from "../../controllers/auth/utilities";
import { NewChatNotification, NEW_POST_NOTIFICATION_EVENT_NAME } from "./eventsConfig";
import { notifyUserIdsOfNewChatMessage } from "./notifyUserIdsOfNewChatMessage";
import { singleton } from "tsyringe";
import { generatePrivateUserWebSocketRoomName } from "./utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { RenderableChatMessage } from "src/controllers/chat/models";
import { notifyUserIdsOfDeletedChatMessage } from "./notifyUserIdsOfDeletedChatMessage";

@singleton()
export class WebSocketService {
  static io: Server;

  static async start(httpServer: httpServer): Promise<void> {
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    WebSocketService.io = io;

    io.on("connection", (socket) => {
      console.log("USER HAS CONNECTED");

      const accessToken = socket.handshake.auth["accessToken"];

      try {
        const userId = validateTokenAndGetUserId({
          token: accessToken,
          jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
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

  public async notifyOfNewPost({
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

    WebSocketService.io.to([roomName]).emit(NEW_POST_NOTIFICATION_EVENT_NAME, message);
  }

  public async notifyUserIdsOfNewChatMessage({
    chatMessage,
    userIds,
  }: {
    chatMessage: RenderableChatMessage;
    userIds: string[];
  }) {
    await BluebirdPromise.map(userIds, async (userId) => {
      await notifyUserIdsOfNewChatMessage({
        io: WebSocketService.io,
        chatMessage,
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
