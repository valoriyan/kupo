import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create, { GetState, SetState } from "zustand";
import createContext from "zustand/context";
import getConfig from "next/config";
import {
  NOTIFICATIONEVENTS,
  RenderableChatMessage,
  RenderableUserNotification,
} from "#/api";
import { generateRenderableNewCommentOnPublishedItemNotificationHandler } from "./renderableNewCommentOnPublishedItemNotificationHandler";
import { generateRenderableNewLikeOnPublishedItemNotificationHandler } from "./renderableNewLikeOnPublishedItemNotificationHandler";
import { generateRenderableNewFollowerNotificationHandler } from "./renderableNewFollowerNotificationHandler";
import { generateUnrenderableCanceledCommentOnPublishedItemNotificationHandler } from "./unrenderableCanceledCommentOnPublishedItemNotificationHandler";
import { generateUnrenderableCanceledNewFollowerNotificationHandler } from "./unrenderableCanceledNewFollowerNotificationHandler";
import { generateUnrenderableCanceledNewLikeOnPublishedItemNotificationHandler } from "./unrenderableCanceledNewLikeOnPublishedItemNotificationHandler";
import { generateNewChatMessageNotificationHandler } from "./newChatMessageNotificationHandler";

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
  mapOfSubscribedChatChannelsToReceivedChatMessages: Map<string, RenderableChatMessage[]>;
  subscribeToChatRoomId: ({ chatRoomId }: { chatRoomId: string }) => void;
  unsubscribeFromChatRoomId: ({ chatRoomId }: { chatRoomId: string }) => void;
}

const generateSocket = ({
  accessToken,
  set,
  get,
}: {
  accessToken: string;
  set: SetState<WebsocketState>;
  get: GetState<WebsocketState>;
}) => {
  const { publicRuntimeConfig } = getConfig();
  const websocketUrl = publicRuntimeConfig.API_BASE_URL;

  const newSocket = io(websocketUrl, { auth: { accessToken }, secure: true });

  newSocket.on("connect", () => {
    console.log("CONNECTED TO WEBSOCKET!");
  });

  newSocket.on(
    NOTIFICATIONEVENTS.NewCommentOnPublishedItem,
    generateRenderableNewCommentOnPublishedItemNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.NewLikeOnPublishedItem,
    generateRenderableNewLikeOnPublishedItemNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.NewFollower,
    generateRenderableNewFollowerNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewCommentOnPublishedItem,
    generateUnrenderableCanceledCommentOnPublishedItemNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewFollower,
    generateUnrenderableCanceledNewFollowerNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewLikeOnPublishedItem,
    generateUnrenderableCanceledNewLikeOnPublishedItemNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.NewTagInPublishedItemComment,
    generateUnrenderableCanceledNewLikeOnPublishedItemNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.NewChatMessage,
    generateNewChatMessageNotificationHandler({ set, get }),
  );

  return newSocket;
};

const createFormStateStore = () =>
  create<WebsocketState>((set, get) => ({
    socket: undefined,
    generateSocket: ({ accessToken }: { accessToken: string }) => {
      const existingSocket = get().socket;
      if (!existingSocket) {
        const socket = generateSocket({ accessToken, get, set });
        set({ socket });
      }
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
    mapOfSubscribedChatChannelsToReceivedChatMessages: new Map(),
    subscribeToChatRoomId: ({ chatRoomId }: { chatRoomId: string }) => {
      console.log(`SUBSCRIBED TO CHANNEL ${chatRoomId}`);
      if (!!chatRoomId) {
        const { mapOfSubscribedChatChannelsToReceivedChatMessages } = get();
        const updatedMapOfSubscribedChatChannelsToReceivedChatMessages = new Map(
          mapOfSubscribedChatChannelsToReceivedChatMessages,
        );
        if (!updatedMapOfSubscribedChatChannelsToReceivedChatMessages.has(chatRoomId)) {
          updatedMapOfSubscribedChatChannelsToReceivedChatMessages.set(chatRoomId, []);
        }
        set({
          mapOfSubscribedChatChannelsToReceivedChatMessages:
            updatedMapOfSubscribedChatChannelsToReceivedChatMessages,
        });
      }
    },
    unsubscribeFromChatRoomId: ({ chatRoomId }: { chatRoomId: string }) => {
      console.log(`UNSUBSCRIBED TO CHANNEL ${chatRoomId}`);

      if (!!chatRoomId) {
        const { mapOfSubscribedChatChannelsToReceivedChatMessages } = get();
        const updatedMapOfSubscribedChatChannelsToReceivedChatMessages = new Map(
          mapOfSubscribedChatChannelsToReceivedChatMessages,
        );
        if (updatedMapOfSubscribedChatChannelsToReceivedChatMessages.has(chatRoomId)) {
          updatedMapOfSubscribedChatChannelsToReceivedChatMessages.delete(chatRoomId);
        }
        set({
          mapOfSubscribedChatChannelsToReceivedChatMessages:
            updatedMapOfSubscribedChatChannelsToReceivedChatMessages,
        });
      }
    },
  }));

const { Provider, useStore } = createContext<WebsocketState>();

export const WebsocketStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useWebsocketState = useStore;
