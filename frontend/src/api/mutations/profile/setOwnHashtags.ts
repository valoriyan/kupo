import { useMutation, useQueryClient } from "react-query";
import { Api, GetClientUserProfileSuccess } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useSetOwnHashtags = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (hashtags: string[]) => {
      return Api.setUserHashtags({
        hashtags: hashtags.filter(Boolean),
      });
    },
    {
      onSuccess: (data, variables) => {
        if (data.data.success) {
          const cacheKey = [CacheKeys.ClientProfile];
          const cachedData: GetClientUserProfileSuccess | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              hashtags: variables,
            });
          }
        }
      },
    },
  );
};
