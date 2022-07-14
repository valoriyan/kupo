import React from "react";
import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

/**
 * An enum containing all of the cache keys that get passed to
 * `react-query`'s `useQuery` hook.
 */
export enum CacheKeys {
  UserById = "UserById",
  UserByUsername = "UserByUsername",
  ClientProfile = "ClientProfile",
  UserPostPages = "UserPostPages",
  UserShopItemPages = "UserShopItemPages",
  ChatRoomsPages = "ChatRoomsPages",
  ChatRoomMessagePages = "ChatRoomMessagePages",
  OldNotificationPages = "OldNotificationPages",
  ChatRoomMembers = "ChatRoomMembers",
  ChatRoomFromId = "ChatRoomFromId",
  ContentFeed = "ContentFeed",
  PostById = "PostById",
  PostComments = "PostComments",
  ContentFilters = "ContentFilters",
  SearchForHashtags = "SearchForHashtags",
  SearchForPosts = "SearchForPosts",
  SearchForPostCaptions = "SearchForPostCaptions",
  SearchForUsers = "SearchForUsers",
  FollowingUsers = "FollowingUsers",
  FollowerUsers = "FollowerUsers",
  SavedPosts = "SavedPosts",
  ResetPasswordTokenValidity = "ResetPasswordTokenValidity",
  CountOfUnreadNotifications = "CountOfUnreadNotifications",
  UserCreditCards = "UserCreditCards",
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangePropsExclusions: ["isStale"],
      staleTime: 5000, // Dedupe any requests made more than once within 5 seconds
      retry: 3, // Will retry failed requests 3 times before displaying an error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const QueryClientProvider = (props: React.PropsWithChildren<unknown>) => {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {props.children}
    </BaseQueryClientProvider>
  );
};
