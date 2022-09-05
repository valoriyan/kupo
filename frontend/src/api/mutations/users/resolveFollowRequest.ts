import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  FollowRequestDecision,
  GetClientUserProfileSuccess,
  GetFollowerRequestsSuccess,
} from "../..";

export const useResolveFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof Api.resolveFollowRequest>>,
    Error,
    { decision: FollowRequestDecision; userIdDoingFollowing: string }
  >(
    async ({ decision, userIdDoingFollowing }) => {
      return await Api.resolveFollowRequest({ decision, userIdDoingFollowing });
    },
    {
      onSuccess: (data, variables) => {
        if (data.data.success) {
          // Update follower request list
          const followerRequests = queryClient.getQueryData<
            InfiniteData<GetFollowerRequestsSuccess>
          >([CacheKeys.FollowerRequests]);
          if (followerRequests) {
            queryClient.setQueryData(CacheKeys.FollowerRequests, {
              ...followerRequests,
              pages: followerRequests.pages.map((page) => ({
                ...page,
                users: page.users.filter(
                  (user) => user.userId !== variables.userIdDoingFollowing,
                ),
              })),
            });
          }

          // Update client user
          if (variables.decision === FollowRequestDecision.Accept) {
            const clientUser = queryClient.getQueryData<GetClientUserProfileSuccess>(
              CacheKeys.ClientProfile,
            );
            if (clientUser) {
              queryClient.setQueryData(CacheKeys.ClientProfile, {
                ...clientUser,
                followers: {
                  ...clientUser.followers,
                  count: clientUser.followers.count + 1,
                },
              });
            }
          }
        }
      },
    },
  );
};
