import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";
import { FileDescriptor, RenderableUser } from "#/api";

export interface MediaDescriptor extends FileDescriptor {
  src: string;
  isLoading: boolean;
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
  mediaFiles: MediaDescriptor[];
  addMedia: (media: MediaDescriptor) => void;
  updateMedia: (media: Partial<MediaDescriptor> & { src: string }) => void;
  getMediaActions: (media: MediaDescriptor) => {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
  // Shop Item Exclusive Fields
  title: string;
  setTitle: (title: string) => void;
  price: number;
  setPrice: (price: number) => void;
  collaboratorUsers: RenderableUser[];
  setCollaboratorUsers: (collaboratorUsers: RenderableUser[]) => void;
  purchasedMediaFiles: MediaDescriptor[];
  addPurchasedMedia: (media: MediaDescriptor) => void;
  updatePurchasedMedia: (media: Partial<MediaDescriptor> & { src: string }) => void;
  getPurchasedMediaActions: (media: MediaDescriptor) => {
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

    updateMedia: (media) => {
      set((prev) => {
        const next = [...prev.mediaFiles];
        const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
        if (currentIndex === -1) return;
        next[currentIndex] = { ...next[currentIndex], ...media };
        return { ...prev, mediaFiles: next };
      });
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

    title: "",
    setTitle: (title) => set({ title }),

    price: 0,
    setPrice: (price) => set({ price }),

    collaboratorUsers: [],
    setCollaboratorUsers: (collaboratorUsers) => set({ collaboratorUsers }),

    purchasedMediaFiles: [],

    addPurchasedMedia: (media) => {
      set((prev) => ({
        ...prev,
        purchasedMediaFiles: [...prev.purchasedMediaFiles, media],
      }));
    },

    updatePurchasedMedia: (media) => {
      set((prev) => {
        const next = [...prev.purchasedMediaFiles];
        const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
        if (currentIndex === -1) return;
        next[currentIndex] = { ...next[currentIndex], ...media };
        return { ...prev, purchasedMediaFiles: next };
      });
    },

    getPurchasedMediaActions: (media) => ({
      moveUp: () =>
        set((prev) => {
          const next = [...prev.purchasedMediaFiles];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === 0) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex - 1, 0, media);
          return { ...prev, purchasedMediaFiles: next };
        }),
      moveDown: () =>
        set((prev) => {
          const next = [...prev.purchasedMediaFiles];
          const currentIndex = next.findIndex((curMedia) => curMedia.src === media.src);
          if (currentIndex === next.length - 1) return prev;
          next.splice(currentIndex, 1);
          next.splice(currentIndex + 1, 0, media);
          return { ...prev, purchasedMediaFiles: next };
        }),
      delete: () =>
        set((prev) => ({
          ...prev,
          purchasedMediaFiles: prev.purchasedMediaFiles.filter(
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
