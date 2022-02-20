import { useQuery, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export const useGetUserByUsername = ({ username }: { username: string }) => {
  const queryClient = useQueryClient();

  return useQuery<RenderableUser, Error>(
    [CacheKeys.UserByUsername, username],
    async () => {
      const res = await Api.getUserProfile({ username }, { authStrat: "tryToken" });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to fetch user");
    },
    {
      onSuccess: async (data) => {
        queryClient.setQueryData([CacheKeys.UserById, data.userId], data);
      },
    },
  );
};
