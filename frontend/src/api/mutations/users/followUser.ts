import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser, UserFollowingStatus } from "../..";
import { updateUserFollowingStatus, updateUsersCache } from "./utilities";

export const useFollowUser = ({
  userIdBeingFollowed,
  usernameBeingFollowed,
}: {
  userIdBeingFollowed: string;
  usernameBeingFollowed: string;
}) => {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.followUser({ userIdBeingFollowed });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          // Update following/follower lists
          updateUserFollowingStatus({
            queryClient,
            clientUserId: userId || "",
            userId: userIdBeingFollowed,
            isFollowing: true,
          });

          // Update client user
          const clientUser = queryClient.getQueryData<RenderableUser>(
            CacheKeys.ClientProfile,
          );
          if (clientUser) {
            queryClient.setQueryData(CacheKeys.ClientProfile, {
              ...clientUser,
              follows: {
                ...clientUser.follows,
                count: clientUser.follows.count + 1,
              },
            });
          }

          // Update followed user
          updateUsersCache({
            updateQueriedUserDataFunction: (user) => {
              if (user) {
                const updatedUser: RenderableUser = {
                  ...user,
                  followers: {
                    ...user.followers,
                    count: user.followers.count + 1,
                  },
                  followingStatusOfClientToUser: UserFollowingStatus.IsFollowing,
                };
                return updatedUser;
              }
              return user;
            },
            queryClient,
            userId: userIdBeingFollowed,
            username: usernameBeingFollowed,
          });
        }
      },
    },
  );
};
