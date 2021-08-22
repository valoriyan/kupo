import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export const useGetUserProfile = () => {
  return useQuery(CacheKeys.UserProfile, async () => {
    const res = await Api.getUserProfile();
    return res.data;
  });
};
