import { useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  FollowingStatus,
  GetClientUserProfileSuccess,
  RenderablePublishingChannel,
} from "../..";

export const useUnfollowCommunity = ({
  communityIdBeingUnfollowed,
  communityNameBeingUnfollowed,
}: {
  communityIdBeingUnfollowed: string;
  communityNameBeingUnfollowed: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.unfollowPublishingChannel({
        publishingChannelIdBeingUnfollowed: communityIdBeingUnfollowed,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          // Update cached client user
          const clientUser = queryClient.getQueryData<GetClientUserProfileSuccess>(
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

          // Update cached community
          const community = queryClient.getQueryData<RenderablePublishingChannel>([
            CacheKeys.CommunityByName,
            communityNameBeingUnfollowed,
          ]);
          if (community) {
            queryClient.setQueryData(
              [CacheKeys.CommunityByName, communityNameBeingUnfollowed],
              {
                ...community,
                followers: {
                  ...community.followers,
                  count: community.followers.count - 1,
                },
                followingStatusOfClientToPublishingChannel: FollowingStatus.NotFollowing,
              },
            );
          }
        }
      },
    },
  );
};
