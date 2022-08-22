import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface ChatRoomFormState {
  newChatMessage: string;
  setNewChatMessage: (newChatMessage: string) => void;
}

const createChatRoomFormStateStore = () =>
  create<ChatRoomFormState>((set) => ({
    newChatMessage: "",
    setNewChatMessage: (newChatMessage) => set({ newChatMessage }),
  }));

const { Provider, useStore } = createContext<ChatRoomFormState>();

export const ChatRoomFormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createChatRoomFormStateStore}>{children}</Provider>;
};

export const useChatRoomFormState = useStore;
