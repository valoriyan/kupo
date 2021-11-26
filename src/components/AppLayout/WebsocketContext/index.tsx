import { PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import createContext from "zustand/context";

export interface WebsocketState {
  socket: Socket | undefined;
  generateSocket: ({ accessToken }: { accessToken: string }) => void;
}

const generateSocket = ({ accessToken }: { accessToken: string }) => {
  const newSocket = io("ws://localhost:4000", {
    auth: {
      accessToken,
    },
  });

  newSocket.on("connect", () => {
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
        const socket = generateSocket({ accessToken });
        set({ socket });
      }
    },
  }));

const { Provider, useStore } = createContext<WebsocketState>();

export const WebsocketStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useWebsocketState = useStore;
