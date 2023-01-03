import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetClientUserProfileSuccess } from "../..";

export const useGetClientUserProfile = (enabled = true) => {
  return useQuery<GetClientUserProfileSuccess, Error>(
    CacheKeys.ClientProfile,
    async () => {
      const res = await Api.getClientUserProfile();

      if (res.data.success) return res.data.success;
      throw new Error((res.data.error.reason as string) ?? "Failed to fetch user");
    },
    { enabled },
  );
};
