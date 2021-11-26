import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";
import { RenderableChatMessage } from "#/api";

export interface FormState {
  newChatMessage: string;
  setNewChatMessage: (newChatMessage: string) => void;

  receivedChatMessages: RenderableChatMessage[];
  receiveNewChatMessage: ({
    chatMessage,
  }: {
    chatMessage: RenderableChatMessage;
  }) => void;
}

const createFormStateStore = () =>
  create<FormState>((set, get) => ({
    newChatMessage: "",
    setNewChatMessage: (newChatMessage) => set({ newChatMessage }),
    receivedChatMessages: [],
    receiveNewChatMessage: ({ chatMessage }) => {
      const chatMessages = get().receivedChatMessages;
      const updatedReceivedChatMessages = [...chatMessages, chatMessage];
      set({ receivedChatMessages: updatedReceivedChatMessages });
    },
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
