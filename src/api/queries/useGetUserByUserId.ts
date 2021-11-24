import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "..";

export interface GetUserByUserIdArgs {
  userId: string;
}

export const useGetUserByUserId = ({ userId }: GetUserByUserIdArgs) => {
  return useQuery<RenderableUser, Error, RenderableUser, (string | undefined)[]>(
    [CacheKeys.User, userId],
    async () => {
      const res = await Api.getUsersByIds({ userIds: [userId] });

      if (!!res.data.success) {
        const users: RenderableUser[] = res.data.success.users;
        if (users.length === 1) {
          return users[0];
        }
        throw new Error("Missing user returned from getUsersByIds");
      }
      throw new Error(res.data.error!.reason);
    },
  );
};
