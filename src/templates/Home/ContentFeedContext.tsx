import { PropsWithChildren } from "react";
import create from "zustand";
import createContext from "zustand/context";

export enum ContentFeedFilterType {
  FOLLOWING_USERS = "FOLLOWING_USERS",
  HASHTAG = "HASHTAG",
}

export interface ContentFeedFilter {
  type: ContentFeedFilterType;
  displayValue: string;
}

export const ContentFeedFollowingUsersFilter: ContentFeedFilter = {
  type: ContentFeedFilterType.FOLLOWING_USERS,
  displayValue: "Following",
};

export const ContentFeedTaylorHashtagFilter: ContentFeedFilter = {
  type: ContentFeedFilterType.HASHTAG,
  displayValue: "taylors",
};

export interface ContentFeedState {
  contentFilters: ContentFeedFilter[];
  selectedContentFilter: ContentFeedFilter;
  setContentFeedFilter: (contentFilter: ContentFeedFilter) => void;
}

const createFormStateStore = () =>
  create<ContentFeedState>((set) => ({
    contentFilters: [ContentFeedFollowingUsersFilter, ContentFeedTaylorHashtagFilter],
    selectedContentFilter: ContentFeedFollowingUsersFilter,
    setContentFeedFilter: (selectedContentFilter) => set({ selectedContentFilter }),
  }));

const { Provider, useStore } = createContext<ContentFeedState>();

export const ContentFeedStateProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <Provider createStore={createFormStateStore}>{children}</Provider>;
};

export const useContentFeedState = useStore;
