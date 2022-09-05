import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetFollowerRequestsSuccess } from "../..";

export const useGetFollowerRequestUsers = () => {
  return useInfiniteQuery<
    GetFollowerRequestsSuccess,
    Error,
    GetFollowerRequestsSuccess,
    string[]
  >(
    [CacheKeys.FollowerRequests],
    ({ pageParam }) => fetchPageOfFollowerUsers({ pageParam }),
    { getNextPageParam: (lastPage) => lastPage.nextPageCursor },
  );
};

async function fetchPageOfFollowerUsers({
  pageParam,
}: {
  pageParam: string | undefined;
}) {
  const res = await Api.getFollowerRequests({ pageSize: 25, cursor: pageParam });

  if (res.data && res.data.success) return res.data.success;
  throw new Error(res.data.error.reason as string);
}
