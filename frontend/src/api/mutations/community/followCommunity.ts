import { useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  FollowingStatus,
  GetClientUserProfileSuccess,
  RenderablePublishingChannel,
} from "../..";

export const useFollowCommunity = ({
  communityIdBeingFollowed,
  communityNameBeingFollowed,
}: {
  communityIdBeingFollowed: string;
  communityNameBeingFollowed: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.followPublishingChannel({
        publishingChannelIdBeingFollowed: communityIdBeingFollowed,
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
                count: clientUser.follows.count + 1,
              },
            });
          }

          // Update cached community
          const community = queryClient.getQueryData<RenderablePublishingChannel>([
            CacheKeys.CommunityByName,
            communityNameBeingFollowed,
          ]);
          if (community) {
            queryClient.setQueryData(
              [CacheKeys.CommunityByName, communityNameBeingFollowed],
              {
                ...community,
                followers: {
                  ...community.followers,
                  count: community.followers.count + 1,
                },
                followingStatusOfClientToPublishingChannel: FollowingStatus.IsFollowing,
              },
            );
          }
        }
      },
    },
  );
};
