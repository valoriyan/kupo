import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create, { GetState, SetState } from "zustand";
import createContext from "zustand/context";
import getConfig from "next/config";
import {
  RenderableNewCommentOnPostNotification,
  RenderableNewFollowerNotification,
  RenderableNewLikeOnPostNotification,
  RenderableUserNotification,
} from "#/api";

const NEW_LIKE_ON_POST_EVENT_NAME = "NEW_LIKE_ON_POST";
const NEW_COMMENT_ON_POST_EVENT_NAME = "NEW_COMMENT_ON_POST";
const NEW_FOLLOWER_EVENT_NAME = "NEW_FOLLOWER";

export interface WebsocketState {
  socket: Socket | undefined;
  generateSocket: ({ accessToken }: { accessToken: string }) => void;
  notificationsReceived: RenderableUserNotification[];
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
    NEW_LIKE_ON_POST_EVENT_NAME,
    (renderableNewLikeOnPostNotification: RenderableNewLikeOnPostNotification) => {
      const notificationsReceived = get().notificationsReceived;
      set({
        notificationsReceived: [
          ...notificationsReceived,
          renderableNewLikeOnPostNotification as RenderableUserNotification,
        ],
      });
    },
  );

  newSocket.on(
    NEW_COMMENT_ON_POST_EVENT_NAME,
    (renderableNewCommentOnPostNotification: RenderableNewCommentOnPostNotification) => {
      const notificationsReceived = get().notificationsReceived;
      set({
        notificationsReceived: [
          ...notificationsReceived,
          renderableNewCommentOnPostNotification as RenderableUserNotification,
        ],
      });
    },
  );

  newSocket.on(
    NEW_FOLLOWER_EVENT_NAME,
    (renderableNewFollowerNotification: RenderableNewFollowerNotification) => {
      const notificationsReceived = get().notificationsReceived;
      set({
        notificationsReceived: [
          ...notificationsReceived,
          renderableNewFollowerNotification as RenderableUserNotification,
        ],
      });
    },
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
  }));

const { Provider, useStore } = createContext<WebsocketState>();

export const WebsocketStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useWebsocketState = useStore;
