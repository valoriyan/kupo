import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetRecommendedPublishingChannelsSuccess } from "../..";

export const useRecommendedCommunities = () => {
  return useQuery<GetRecommendedPublishingChannelsSuccess, Error>(
    [CacheKeys.RecommendedPublishingChannels],
    async () => {
      const res = await Api.getRecommendedPublishingChannels({});

      if (res.data.success) return res.data.success;
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to get recommended communities",
      );
    },
  );
};
