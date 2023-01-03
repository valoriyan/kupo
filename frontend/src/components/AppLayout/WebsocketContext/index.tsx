import getConfig from "next/config";
import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import createContext from "zustand/context";
import {
  NOTIFICATIONEVENTS,
  RenderableChatMessage,
  RenderableUserNotification,
} from "#/api";
import { getNewChatMessageNotificationHandler } from "./chatMessageNotificationHandlers";
import {
  getCanceledCommentOnPublishedItemNotificationHandler,
  getNewCommentOnPublishedItemNotificationHandler,
} from "./newCommentOnPublishedItemNotificationHandlers";
import {
  getCanceledNewFollowerNotificationHandler,
  getNewFollowerNotificationHandler,
} from "./newFollowerNotificationHandlers";
import {
  getCanceledNewLikeOnPublishedItemNotificationHandler,
  getNewLikeOnPublishedItemNotificationHandler,
} from "./newLikeOnPublishedItemNotificationHandlers";

export interface WebsocketState {
  socket: Socket | undefined;
  generateSocket: ({ accessToken }: { accessToken: string }) => void;

  //////////////////////////////////////////////////
  // USER NOTIFICATIONS
  //////////////////////////////////////////////////
  updatedCountOfUnreadNotifications: number | undefined;
  notificationsReceived: RenderableUserNotification[];
  markAllNotificationsAsSeen: () => void;

  //////////////////////////////////////////////////
  // CHAT
  //////////////////////////////////////////////////
  updatedCountOfUnreadChatRooms: number | undefined;
  receivedChatMessagesByChatRoomId: Map<string, RenderableChatMessage[]>;
  subscribeToChatRoomId: (chatRoomId: string) => void;
  unsubscribeFromChatRoomId: (chatRoomId: string) => void;
}

const createWebsocketStateStore = () =>
  create<WebsocketState>((set, get) => ({
    socket: undefined,
    generateSocket: ({ accessToken }: { accessToken: string }) => {
      const existingSocket = get().socket;
      if (existingSocket) return;

      const { publicRuntimeConfig } = getConfig();
      const websocketUrl = publicRuntimeConfig.API_BASE_URL;

      const newSocket = io(websocketUrl, { auth: { accessToken }, secure: true });

      newSocket.on("connect", () => {
        console.log("CONNECTED TO WEBSOCKET");
      });

      newSocket.on(
        NOTIFICATIONEVENTS.NewFollower,
        getNewFollowerNotificationHandler({ set, get }),
      );
      newSocket.on(
        NOTIFICATIONEVENTS.CanceledNewFollower,
        getCanceledNewFollowerNotificationHandler({ set, get }),
      );

      newSocket.on(
        NOTIFICATIONEVENTS.NewCommentOnPublishedItem,
        getNewCommentOnPublishedItemNotificationHandler({ set, get }),
      );
      newSocket.on(
        NOTIFICATIONEVENTS.CanceledNewCommentOnPublishedItem,
        getCanceledCommentOnPublishedItemNotificationHandler({ set, get }),
      );

      newSocket.on(
        NOTIFICATIONEVENTS.NewLikeOnPublishedItem,
        getNewLikeOnPublishedItemNotificationHandler({ set, get }),
      );
      newSocket.on(
        NOTIFICATIONEVENTS.CanceledNewLikeOnPublishedItem,
        getCanceledNewLikeOnPublishedItemNotificationHandler({ set, get }),
      );

      newSocket.on(
        NOTIFICATIONEVENTS.NewTagInPublishedItemComment,
        getCanceledNewLikeOnPublishedItemNotificationHandler({ set, get }),
      );

      newSocket.on(
        NOTIFICATIONEVENTS.NewChatMessage,
        getNewChatMessageNotificationHandler({ set, get }),
      );

      set({ socket: newSocket });
    },

    //////////////////////////////////////////////////
    // USER NOTIFICATIONS
    //////////////////////////////////////////////////
    updatedCountOfUnreadNotifications: undefined,
    notificationsReceived: [],
    markAllNotificationsAsSeen: () => {
      set({ updatedCountOfUnreadNotifications: 0 });
    },

    //////////////////////////////////////////////////
    // CHAT
    //////////////////////////////////////////////////
    updatedCountOfUnreadChatRooms: undefined,
    receivedChatMessagesByChatRoomId: new Map(),
    subscribeToChatRoomId: (chatRoomId) => {
      console.log(`SUBSCRIBED TO CHAT ROOM ${chatRoomId}`);

      if (!!chatRoomId) {
        const { receivedChatMessagesByChatRoomId } = get();
        const updatedReceivedChatMessagesByChatRoomId = new Map(
          receivedChatMessagesByChatRoomId,
        );
        if (!updatedReceivedChatMessagesByChatRoomId.has(chatRoomId)) {
          updatedReceivedChatMessagesByChatRoomId.set(chatRoomId, []);
        }
        set({
          receivedChatMessagesByChatRoomId: updatedReceivedChatMessagesByChatRoomId,
        });
      }
    },
    unsubscribeFromChatRoomId: (chatRoomId) => {
      console.log(`UNSUBSCRIBED TO CHAT ROOM ${chatRoomId}`);

      if (!!chatRoomId) {
        const { receivedChatMessagesByChatRoomId } = get();
        const updatedReceivedChatMessagesByChatRoomId = new Map(
          receivedChatMessagesByChatRoomId,
        );
        if (updatedReceivedChatMessagesByChatRoomId.has(chatRoomId)) {
          updatedReceivedChatMessagesByChatRoomId.delete(chatRoomId);
        }
        set({
          receivedChatMessagesByChatRoomId: updatedReceivedChatMessagesByChatRoomId,
        });
      }
    },
  }));

const { Provider, useStore } = createContext<WebsocketState>();

export const WebsocketStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createWebsocketStateStore}>{children}</Provider>;
};

export const useWebsocketState = useStore;
