import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface FormState {
  newChatMessage: string;
  setNewChatMessage: (newChatMessage: string) => void;
}

const createFormStateStore = () =>
  create<FormState>((set) => ({
    newChatMessage: "",
    setNewChatMessage: (newChatMessage) => set({ newChatMessage }),
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
