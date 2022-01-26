import { useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, UserContentFeedFilter } from "#/api";

export const useUpdateContentFilters = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updatedContentFilters: UserContentFeedFilter[]) => {
      // TODO: Send new filters to the backend

      return await Api.setUserContentFeedFilters({
        requestedContentFeedFilters: updatedContentFilters,
      });
    },
    {
      onMutate: (data) => {
        queryClient.setQueryData<UserContentFeedFilter[]>(
          [CacheKeys.ContentFilters],
          () => data,
        );
      },
    },
  );
};
