import { useMutation, useQueryClient } from "react-query";
import { Api, Color, RenderableUser } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateOwnProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      username,
      shortBio,
      userWebsite,
      preferredPagePrimaryColor,
    }: {
      username?: string;
      shortBio?: string;
      userWebsite?: string;
      preferredPagePrimaryColor?: Color;
    }) => {
      return await Api.updateUserProfile({
        username,
        shortBio,
        userWebsite,
        preferredPagePrimaryColor,
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.UserProfile, data.data.success.username];
          const cachedData: RenderableUser | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              username: data.data.success.username,
              shortBio: data.data.success.shortBio,
              userWebsite: data.data.success.userWebsite,
              preferredPagePrimaryColor: data.data.success.preferredPagePrimaryColor,
            });
          }
        }
      },
    },
  );
};
