import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export const useGetClientUserProfile = () => {
  return useQuery<RenderableUser, Error>(CacheKeys.ClientProfile, async () => {
    const res = await Api.getUserProfile({});

    if (res.data.success) return res.data.success;
    throw new Error(res.data.error?.reason ?? "Failed to fetch user");
  });
};
