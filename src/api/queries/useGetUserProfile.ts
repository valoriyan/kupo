import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "..";

export interface GetUserProfileArgs {
  username?: string;
  isOwnProfile?: boolean;
}

export const useGetUserProfile = ({ username, isOwnProfile }: GetUserProfileArgs) => {
  return useQuery<RenderableUser, Error, RenderableUser, (string | undefined)[]>(
    [CacheKeys.UserProfile, username],
    async () => {
      const res = await Api.getUserProfile({ username }, { noAuth: !!username });

      if (!!res.data.success) {
        const user: RenderableUser = res.data.success;
        return user;
      }
      throw new Error(res.data.error!.reason);
    },
    { enabled: isOwnProfile || !!username },
  );
};
