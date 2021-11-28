import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export const useGetUsersByUsernames = ({ usernames }: { usernames: string[] }) => {
  return useQuery<
    (RenderableUser | null)[],
    Error,
    (RenderableUser | null)[],
    (string | undefined)[]
  >(
    [CacheKeys.User, ...usernames.slice().sort()],
    async () => {
      const res = await Api.getUsersByUsernames({ usernames });

      if (!!res.data.success) {
        const users: (RenderableUser | null)[] = res.data.success.users;
        return users;
        throw new Error("Missing user returned from getUsersByUsernames");
      }
      throw new Error(res.data.error!.reason);
    },
    { enabled: !!usernames && usernames.length > 0 },
  );
};
