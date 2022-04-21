import { InfiniteData, QueryClient } from "react-query";
import {
  GetPageOfUsersFollowedByUserIdSuccess,
  GetPageOfUsersFollowingUserIdSuccess,
  RenderableUser,
} from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export type UpdateQueriedUserDataFunction = (
  queriedData: RenderableUser | undefined,
) => RenderableUser | undefined;

const updateUsersByIdCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  userId,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  userId: string;
}) => {
  const queryKey = [CacheKeys.UserById, userId];

  queryClient.setQueryData<RenderableUser | undefined>(
    queryKey,
    updateQueriedUserDataFunction,
  );
};

const updateUsersByUsernameCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  username,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  username: string;
}) => {
  const queryKey = [CacheKeys.UserByUsername, username];

  queryClient.setQueryData<RenderableUser | undefined>(
    queryKey,
    updateQueriedUserDataFunction,
  );
};

export const updateUsersCache = ({
  updateQueriedUserDataFunction,
  queryClient,
  userId,
  username,
}: {
  updateQueriedUserDataFunction: UpdateQueriedUserDataFunction;
  queryClient: QueryClient;
  userId: string;
  username: string;
}) => {
  updateUsersByIdCache({
    updateQueriedUserDataFunction,
    queryClient,
    userId,
  });

  updateUsersByUsernameCache({
    updateQueriedUserDataFunction,
    queryClient,
    username,
  });
};

export const updateUserFollowingStatus = ({
  queryClient,
  clientUserId,
  userId,
  isFollowing,
}: {
  queryClient: QueryClient;
  clientUserId: string;
  userId: string;
  isFollowing: boolean;
}) => {
  const followingUsersCacheKey = [CacheKeys.FollowingUsers, clientUserId];
  const clientFollowingData =
    queryClient.getQueryData<InfiniteData<GetPageOfUsersFollowedByUserIdSuccess>>(
      followingUsersCacheKey,
    );

  if (clientFollowingData) {
    const updatedFollowingData = {
      ...clientFollowingData,
      pages: clientFollowingData.pages.map((page) => ({
        ...page,
        users: page.users.flatMap((user) =>
          user.userId === userId && !isFollowing ? [] : [user],
        ),
      })),
    };
    queryClient.setQueryData(followingUsersCacheKey, updatedFollowingData);
  }

  const followerUsersCacheKey = [CacheKeys.FollowerUsers, clientUserId];
  const clientFollowersData =
    queryClient.getQueryData<InfiniteData<GetPageOfUsersFollowingUserIdSuccess>>(
      followerUsersCacheKey,
    );

  if (clientFollowersData) {
    const updatedFollowersData = {
      ...clientFollowingData,
      pages: clientFollowersData.pages.map((page) => ({
        ...page,
        users: page.users.map((user) => {
          if (user.userId === userId) {
            return { ...user, isBeingFollowedByClient: isFollowing };
          } else {
            return user;
          }
        }),
      })),
    };
    queryClient.setQueryData(followerUsersCacheKey, updatedFollowersData);
  }
};
