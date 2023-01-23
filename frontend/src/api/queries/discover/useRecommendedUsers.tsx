import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetRecommendedUsersToFollowSuccess } from "../..";

export const useRecommendedUsers = () => {
  return useQuery<GetRecommendedUsersToFollowSuccess, Error>(
    [CacheKeys.RecommendedUsers],
    async () => {
      const res = await Api.getRecommendedUsersToFollow({});

      if (res.data.success) return res.data.success;
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to get recommended users",
      );
    },
  );
};
