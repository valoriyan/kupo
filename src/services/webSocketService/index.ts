import { Server } from "socket.io";
import { Server as httpServer } from "http";
import { validateTokenAndGetUserId } from "../../controllers/auth/utilities";
import {
  ChatMessage,
  NewChatNotification,
  NEW_CHAT_MESSAGE_EVENT_NAME,
  NEW_POST_NOTIFICATION_EVENT_NAME,
} from "./eventsConfig";
import { handleNewChatMessage } from "./handleNewChatMessage";
import { singleton } from "tsyringe";
import { generatePrivateUserWebSocketRoomName } from "./utilities";

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

        console.log(rooms);

        socket.on(
          NEW_CHAT_MESSAGE_EVENT_NAME,
          (incomingMessage: ChatMessage, sendAcknowledgement) => {
            console.log("MESSAGE CAME IN!");
            console.log(incomingMessage);
            console.log(sendAcknowledgement);

            handleNewChatMessage({
              io,
              incomingMessage,
              incomingUserId: userId,
              sendAcknowledgement,
            });
          },
        );
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
}
