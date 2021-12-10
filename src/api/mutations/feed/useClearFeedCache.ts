import { CacheKeys } from "#/contexts/queryClient";
import { useMutation, useQueryClient } from "react-query";

export const useClearFeedCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: async () => {
      queryClient.resetQueries([CacheKeys.ContentFeed], { exact: true });
      queryClient.removeQueries([CacheKeys.ContentFeed], { exact: true });
      queryClient.cancelQueries([CacheKeys.ContentFeed], { exact: true });
    }
  })
}