import { useMutation, useQueryClient } from "react-query";
import { Api, Color, ProfilePrivacySetting, GetClientUserProfileSuccess } from "#/api";
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
        username: username ?? "",
        shortBio: shortBio ?? "",
        userWebsite: userWebsite ?? "",
        userEmail: userEmail ?? "",
        phoneNumber: "",
        preferredPagePrimaryColor: preferredPagePrimaryColor ?? {
          red: 12,
          green: 1,
          blue: 12,
        },
        profileVisibility: profileVisibility ?? ProfilePrivacySetting.Public,
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.ClientProfile];
          const cachedData: GetClientUserProfileSuccess | undefined =
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
