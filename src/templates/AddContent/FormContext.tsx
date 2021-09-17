import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface Media {
  type: string;
  src: string;
}

export interface FormState {
  mediaPreviews: Media[];
  addMedia: (media: Media) => void;
  getMediaActions: (media: Media) => {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
}

const createFormStateStore = () =>
  create<FormState>((set) => ({
    mediaPreviews: [],

    addMedia: (media) => {
      set((prev) => ({ ...prev, mediaPreviews: [...prev.mediaPreviews, media] }));
    },

    getMediaActions: (media) => ({
      moveUp: () =>
        set((prev) => {
          const next = [...prev.mediaPreviews];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === 0) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex - 1, 0, media);
          return { ...prev, mediaPreviews: next };
        }),
      moveDown: () =>
        set((prev) => {
          const next = [...prev.mediaPreviews];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === next.length - 1) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex + 1, 0, media);
          return { ...prev, mediaPreviews: next };
        }),
      delete: () =>
        set((prev) => ({
          ...prev,
          mediaPreviews: prev.mediaPreviews.filter(
            (curMedia) => curMedia.src !== media.src,
          ),
        })),
    }),
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
