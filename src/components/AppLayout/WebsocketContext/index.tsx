import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create, { GetState, SetState } from "zustand";
import createContext from "zustand/context";
import getConfig from "next/config";
import { NOTIFICATIONEVENTS, RenderableUserNotification } from "#/api";
import { generateRenderableNewCommentOnPostNotificationHandler } from "./renderableNewCommentOnPostNotificationHandler";
import { generateRenderableNewLikeOnPostNotificationHandler } from "./renderableNewLikeOnPostNotificationHandler";
import { generateRenderableNewFollowerNotificationHandler } from "./renderableNewFollowerNotificationHandler";
import { generateUnrenderableCanceledCommentOnPostNotificationHandler } from "./unrenderableCanceledCommentOnPostNotificationHandler";
import { generateUnrenderableCanceledNewFollowerNotificationHandler } from "./unrenderableCanceledNewFollowerNotificationHandler";
import { generateUnrenderableCanceledNewLikeOnPostNotificationHandler } from "./unrenderableCanceledNewLikeOnPostNotificationHandler";

export interface WebsocketState {
  socket: Socket | undefined;
  generateSocket: ({ accessToken }: { accessToken: string }) => void;
  notificationsReceived: RenderableUserNotification[];
  updatedCountOfUnreadNotifications: number | undefined;
  markAllNotificationsAsSeen: () => void;
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
    NOTIFICATIONEVENTS.NewCommentOnPost,
    generateRenderableNewCommentOnPostNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.NewLikeOnPost,
    generateRenderableNewLikeOnPostNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.NewFollower,
    generateRenderableNewFollowerNotificationHandler({ set, get }),
  );

  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewCommentOnPost,
    generateUnrenderableCanceledCommentOnPostNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewFollower,
    generateUnrenderableCanceledNewFollowerNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.CanceledNewLikeOnPost,
    generateUnrenderableCanceledNewLikeOnPostNotificationHandler({ set, get }),
  );
  newSocket.on(
    NOTIFICATIONEVENTS.NewTagInPublishedItemComment,
    generateUnrenderableCanceledNewLikeOnPostNotificationHandler({ set, get }),
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
    notificationsReceived: [],
    updatedCountOfUnreadNotifications: undefined,
    markAllNotificationsAsSeen: () => {
      set({ updatedCountOfUnreadNotifications: 0 });
    },
  }));

const { Provider, useStore } = createContext<WebsocketState>();

export const WebsocketStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useWebsocketState = useStore;
