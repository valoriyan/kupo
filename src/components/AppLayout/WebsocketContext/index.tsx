import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create, { GetState, SetState } from "zustand";
import createContext from "zustand/context";
import getConfig from "next/config";

export interface WebsocketState {
  socket: Socket | undefined;
  generateSocket: ({ accessToken }: { accessToken: string }) => void;

  notificationsReceived: string[];
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

  const websocketUrl = publicRuntimeConfig.API_WEBSOCKET_URL;

  const newSocket = io(websocketUrl, {
    auth: {
      accessToken,
    },
    secure: true,
  });

  newSocket.on("connect", () => {
    const notificationsReceived = get().notificationsReceived;
    set({ notificationsReceived: [...notificationsReceived, "CONNECTED"] });
    console.log("CONNECTED!");
  });

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
