import { useMutation, useQueryClient } from "react-query";
import { Api, RenderableUser } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateOwnBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ file }: { file: File }) => {
      return await Api.updateUserBackgroundImage(file);
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const cacheKey = [CacheKeys.UserProfile, undefined];
          const cachedData: RenderableUser | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              backgroundImageTemporaryUrl: data.data.success.backgroundImageTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
