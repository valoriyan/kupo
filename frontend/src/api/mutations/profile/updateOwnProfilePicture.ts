import { useMutation, useQueryClient } from "react-query";
import { Api, GetClientUserProfileSuccess } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateOwnProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (file: File) => {
      return await Api.updateUserProfilePicture(file);
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
              profilePictureTemporaryUrl: data.data.success.profilePictureTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
