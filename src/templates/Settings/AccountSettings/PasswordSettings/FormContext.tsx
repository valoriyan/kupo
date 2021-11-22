import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface FormState {
  newPassword: string;
  setNewPassword: (newPassword: string) => void;

  confirmedNewPassword: string;
  setConfirmedNewPassword: (confirmedNewPassword: string) => void;
}

const createFormStateStore = () => create<FormState>((set) => ({
  newPassword: "",
  setNewPassword: (newPassword) => set({newPassword}),


  confirmedNewPassword: "",
  setConfirmedNewPassword: (confirmedNewPassword) => set({confirmedNewPassword}),
}));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
