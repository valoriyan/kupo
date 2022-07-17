import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export const useGetUsersByUsernames = ({ usernames }: { usernames: string[] }) => {
  return useQuery<(RenderableUser | null)[], Error>(
    [CacheKeys.UserById, ...usernames.slice().sort()],
    async () => {
      const res = await Api.getUsersByUsernames({ usernames });

      if (res.data.success) {
        return res.data.success.users;
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to fetch users");
    },
    { enabled: !!usernames.length },
  );
};
