import { useMutation, useQueryClient } from "react-query";
import { Api, RenderableUser } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useSetOwnHashtags = ({hashtags, username}: {hashtags: string[]; username: string;}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return Api.setUserHashtags({
        hashtags: hashtags.filter((hashtag) => !!hashtag),
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.UserProfile, username];
          const cachedData: RenderableUser | undefined = queryClient.getQueryData(cacheKey);
          
          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              hashtags,
            });
          }
        }
        
      },
    },
  );
};
