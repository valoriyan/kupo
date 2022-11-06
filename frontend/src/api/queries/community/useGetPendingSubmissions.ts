import { AxiosResponse } from "axios";
import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  EitherErrorReasonTypesStringOrGetPublishingChannelSubmissionsFailedReasonGetPublishingChannelSubmissionsSuccess,
  GetPublishingChannelSubmissionsSuccess,
} from "../..";

export const useGetPendingSubmissions = (publishingChannelId: string) => {
  return useInfiniteQuery<
    GetPublishingChannelSubmissionsSuccess,
    AxiosResponse<EitherErrorReasonTypesStringOrGetPublishingChannelSubmissionsFailedReasonGetPublishingChannelSubmissionsSuccess>,
    GetPublishingChannelSubmissionsSuccess
  >(
    [CacheKeys.CommunityPendingSubmissions, publishingChannelId],
    ({ pageParam }) => fetchPageOfPendingSubmissions({ pageParam, publishingChannelId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!publishingChannelId,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        if (failureCount > 2) return false;
        return true;
      },
    },
  );
};

export async function fetchPageOfPendingSubmissions({
  pageParam,
  publishingChannelId,
}: {
  pageParam: string | undefined;
  publishingChannelId: string;
}) {
  const res = await Api.getPublishingChannelSubmissions({
    publishingChannelId,
    pageSize: 25,
    cursor: pageParam,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }
  throw res;
}
