import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetUserProfileArgs {
  username?: string;
  isOwnProfile?: boolean;
}

export const useGetUserProfile = ({ username, isOwnProfile }: GetUserProfileArgs) => {
  return useQuery(
    [CacheKeys.UserProfile, username],
    async () => {
      const res = await Api.getUserProfile({ username }, { noAuth: !!username });
      return res.data;
    },
    { enabled: isOwnProfile || !!username },
  );
};
