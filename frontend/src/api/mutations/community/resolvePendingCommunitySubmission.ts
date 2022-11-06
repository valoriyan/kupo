import { InfiniteData, useMutation, useQueryClient } from "react-query";
import {
  Api,
  GetPublishingChannelSubmissionsSuccess,
  ResolvePublishingChannelSubmissionRequestBody,
} from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useResolvePendingCommunitySubmission = (publishingChannelName: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (args: ResolvePublishingChannelSubmissionRequestBody) => {
      return await Api.resolvePublishingChannelSubmission(args);
    },
    {
      onSuccess: (data, variables) => {
        if (!data.data.success) return;

        const pendingSubmissionsQueries = queryClient.getQueriesData<
          InfiniteData<GetPublishingChannelSubmissionsSuccess>
        >([CacheKeys.CommunityPendingSubmissions]);

        for (const [queryKey, queryData] of pendingSubmissionsQueries) {
          queryClient.setQueryData<InfiniteData<GetPublishingChannelSubmissionsSuccess>>(
            queryKey,
            {
              ...queryData,
              pages: queryData.pages.map((page) => ({
                ...page,
                publishedSubmissions: page.publishedSubmissions.filter(
                  (item) => item.submissionId !== variables.publishingChannelSubmissionId,
                ),
              })),
            },
          );
        }

        queryClient.invalidateQueries([
          CacheKeys.CommunityPostPages,
          publishingChannelName,
        ]);
        queryClient.invalidateQueries([
          CacheKeys.CommunityShopItemPages,
          publishingChannelName,
        ]);
      },
    },
  );
};
