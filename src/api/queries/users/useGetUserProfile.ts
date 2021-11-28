import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderableUser } from "../..";

export interface GetUserProfileArgs {
  username?: string;
  isOwnProfile?: boolean;
}

export const useGetUserProfile = ({ username, isOwnProfile }: GetUserProfileArgs) => {
  return useQuery<RenderableUser, Error>(
    [CacheKeys.UserProfile, username],
    async () => {
      const res = await Api.getUserProfile({ username }, { noAuth: !!username });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to fetch user");
    },
    { enabled: isOwnProfile || !!username },
  );
};
