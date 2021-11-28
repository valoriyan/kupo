import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";
import { Color, RenderableUser } from "#/api";
import { defaultPreferredPagePrimaryColor } from "./config";

export interface FormState {
  username: string;
  setUsername: (username: string) => void;

  shortBio: string;
  setShortBio: (shortBio: string) => void;

  userWebsite: string;
  setUserWebsite: (userWebsite: string) => void;

  preferredPagePrimaryColor: Color;
  setPreferredPagePrimaryColor: (preferredPagePrimaryColor: Color) => void;

  hashTags: string[];
  setHashTags: (hashTags: string[]) => void;
}

const createFormStateStore =
  ({ renderableUser }: { renderableUser: RenderableUser }) =>
  () =>
    create<FormState>((set) => ({
      username: renderableUser.username,
      setUsername: (updatedUsername) => set({ username: updatedUsername }),

      shortBio: renderableUser.shortBio || "",
      setShortBio: (updatedShortBio) => set({ shortBio: updatedShortBio }),

      userWebsite: renderableUser.userWebsite || "",
      setUserWebsite: (updatedUserWebsite) => set({ userWebsite: updatedUserWebsite }),

      preferredPagePrimaryColor:
        renderableUser.preferredPagePrimaryColor || defaultPreferredPagePrimaryColor,
      setPreferredPagePrimaryColor: (updatedPreferredPagePrimaryColor) =>
        set({ preferredPagePrimaryColor: updatedPreferredPagePrimaryColor }),

      hashTags: renderableUser.hashtags,
      setHashTags: (updatedHashTags) => set({ hashTags: updatedHashTags }),
    }));

const { Provider, useStore } = createContext<FormState>();

export const FormStateProvider = ({
  children,
  renderableUser,
}: PropsWithChildren<{
  renderableUser: RenderableUser;
}>) => {
  return (
    <Provider
      createStore={createFormStateStore({
        renderableUser,
      })}
    >
      {children}
    </Provider>
  );
};

export const useFormState = useStore;
