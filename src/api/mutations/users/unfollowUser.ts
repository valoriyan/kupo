import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { Api, RenderableUser } from "../..";
import { updateUserFollowingStatus, updateUsersCache } from "./utilities";
import { CacheKeys } from "#/contexts/queryClient";

export const useUnfollowUser = ({
  userIdBeingUnfollowed,
  usernameBeingUnfollowed,
}: {
  userIdBeingUnfollowed: string;
  usernameBeingUnfollowed: string;
}) => {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.unfollowUser({ userIdBeingUnfollowed });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          // Update following/follower lists
          updateUserFollowingStatus({
            queryClient,
            clientUserId: userId || "",
            userId: userIdBeingUnfollowed,
            isFollowing: false,
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
                count: clientUser.follows.count - 1,
              },
            });
          }

          // Update unfollowed user
          updateUsersCache({
            updateQueriedUserDataFunction: (user) => {
              if (user) {
                return {
                  ...user,
                  followers: {
                    ...user.followers,
                    count: user.followers.count - 1,
                  },
                  isBeingFollowedByClient: false,
                };
              }
              return user;
            },
            queryClient,
            userId: userIdBeingUnfollowed,
            username: usernameBeingUnfollowed,
          });
        }
      },
    },
  );
};
