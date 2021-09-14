import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface FormState {
  mediaPreviews: string[];
  addMedia: (src: string) => void;
  getMediaActions: (id: string) => {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
}

const createFormStateStore = () =>
  create<FormState>((set) => ({
    mediaPreviews: [],

    addMedia: (src) => {
      set((prev) => ({ ...prev, mediaPreviews: [...prev.mediaPreviews, src] }));
    },

    getMediaActions: (id) => ({
      moveUp: () =>
        set((prev) => {
          const next = [...prev.mediaPreviews];
          const currentIndex = next.indexOf(id);
          if (currentIndex === 0) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex - 1, 0, id);
          return { ...prev, mediaPreviews: next };
        }),
      moveDown: () =>
        set((prev) => {
          const next = [...prev.mediaPreviews];
          const currentIndex = next.indexOf(id);
          if (currentIndex === next.length - 1) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex + 1, 0, id);
          return { ...prev, mediaPreviews: next };
        }),
      delete: () =>
        set((prev) => ({
          ...prev,
          mediaPreviews: prev.mediaPreviews.filter((mediaId) => mediaId !== id),
        })),
    }),
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
