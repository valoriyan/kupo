import { useMutation, useQueryClient } from "react-query";
import { ContentFilter } from "#/api/queries/feed/useGetContentFilters";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateContentFilters = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newContentFilters: ContentFilter[]) => {
      // TODO: Send new filters to the backend
      return newContentFilters;
    },
    {
      onMutate: (data) => {
        queryClient.setQueryData<ContentFilter[]>([CacheKeys.ContentFilters], () => data);
      },
    },
  );
};
