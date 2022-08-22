import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export interface GetUserByUserIdArgs {
  userId: string;
}

export const useGetUserByUserId = ({ userId }: GetUserByUserIdArgs) => {
  return useQuery<RenderableUser, Error>(
    [CacheKeys.UserById, userId],
    async () => {
      const res = await Api.getUsersByIds({ userIds: [userId] });

      if (res.data.success) {
        const users = res.data.success.users;
        if (users.length === 1) {
          return users[0];
        }
        throw new Error("No user found");
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to fetch user");
    },
    { enabled: !!userId },
  );
};
