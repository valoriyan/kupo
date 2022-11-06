import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPublishingChannelsFollowedByUserIdSuccess } from "../..";

export const useGetFollowingCommunities = () => {
  return useInfiniteQuery<
    GetPublishingChannelsFollowedByUserIdSuccess,
    Error,
    GetPublishingChannelsFollowedByUserIdSuccess,
    string[]
  >(
    [CacheKeys.FollowingCommunities],
    ({ pageParam }) => fetchPageOfFollowingCommunities({ pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    },
  );
};

async function fetchPageOfFollowingCommunities({
  pageParam,
}: {
  pageParam: string | undefined;
}) {
  const res = await Api.getPublishingChannelsFollowedByUserId({
    pageSize: 25,
    cursor: pageParam,
    areFollowsPending: false,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error.reason as string);
}
