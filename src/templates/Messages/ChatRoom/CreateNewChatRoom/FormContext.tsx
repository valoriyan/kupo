import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface FormState {
  usernamesInChatRoom: string[];
  setUsernamesInChatRoom: (usernames: string[]) => void;
}

const createFormStateStore = () =>
  create<FormState>((set) => ({
    usernamesInChatRoom: [],
    setUsernamesInChatRoom: (usernames) => set({ usernamesInChatRoom: usernames }),
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
