import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export interface Media {
  file: File;
  src: string;
}

export interface FormState {
  caption: string;
  setCaption: (caption: string) => void;
  hashTags: string[];
  setHashTags: (hashTags: string[] | ((prev: string[]) => string[])) => void;
  publicationDate: Date | undefined;
  setPublicationDate: (publicationDate: Date | undefined) => void;
  expirationDate: Date | undefined;
  setExpirationDate: (expirationDate: Date | undefined) => void;
  mediaFiles: Media[];
  addMedia: (media: Media) => void;
  getMediaActions: (media: Media) => {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
}

const createFormStateStore = () =>
  create<FormState>((set) => ({
    caption: "",
    setCaption: (caption) => set({ caption }),

    hashTags: [],
    setHashTags: (hashTags) => {
      if (Array.isArray(hashTags)) {
        set({ hashTags });
      } else {
        set((prev) => ({ hashTags: hashTags(prev.hashTags) }));
      }
    },

    publicationDate: undefined,
    setPublicationDate: (publicationDate) => set({ publicationDate }),

    expirationDate: undefined,
    setExpirationDate: (expirationDate) => set({ expirationDate }),

    mediaFiles: [],

    addMedia: (media) => {
      set((prev) => ({ ...prev, mediaFiles: [...prev.mediaFiles, media] }));
    },

    getMediaActions: (media) => ({
      moveUp: () =>
        set((prev) => {
          const next = [...prev.mediaFiles];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === 0) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex - 1, 0, media);
          return { ...prev, mediaFiles: next };
        }),
      moveDown: () =>
        set((prev) => {
          const next = [...prev.mediaFiles];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === next.length - 1) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex + 1, 0, media);
          return { ...prev, mediaFiles: next };
        }),
      delete: () =>
        set((prev) => ({
          ...prev,
          mediaFiles: prev.mediaFiles.filter((curMedia) => curMedia.src !== media.src),
        })),
    }),
  }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useFormState = useStore;
