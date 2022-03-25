import { useMutation, useQueryClient } from "react-query";
import { Api, Color, ProfilePrivacySetting, RenderableUser } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateOwnProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      username,
      shortBio,
      userWebsite,
      userEmail,
      preferredPagePrimaryColor,
      profileVisibility,
    }: {
      username?: string;
      shortBio?: string;
      userWebsite?: string;
      userEmail?: string;
      preferredPagePrimaryColor?: Color;
      profileVisibility?: ProfilePrivacySetting;
    }) => {
      return await Api.updateUserProfile({
        username: username ?? undefined,
        shortBio: shortBio ?? undefined,
        userWebsite: userWebsite ?? undefined,
        userEmail: userEmail ?? undefined,
        phoneNumber: undefined,
        preferredPagePrimaryColor: preferredPagePrimaryColor ?? undefined,
        profileVisibility: profileVisibility ?? undefined,
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.ClientProfile, data.data.success.username];
          const cachedData: RenderableUser | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              username: data.data.success.username,
              shortBio: data.data.success.shortBio,
              userWebsite: data.data.success.userWebsite,
              email: data.data.success.email,
              preferredPagePrimaryColor: data.data.success.preferredPagePrimaryColor,
            });
          }
        }
      },
    },
  );
};
