import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export const useGetUsersByUserIds = ({ userIds }: { userIds: string[] }) => {
  return useQuery<(RenderableUser | null)[], Error>(
    [CacheKeys.UserById, ...userIds.slice().sort()],
    async () => {
      const res = await Api.getUsersByIds({ userIds }, { authStrat: "tryToken" });

      if (res.data.success) {
        const users: (RenderableUser | null)[] = res.data.success.users;
        return users;
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to fetch users");
    },
    { enabled: !!userIds.length },
  );
};
