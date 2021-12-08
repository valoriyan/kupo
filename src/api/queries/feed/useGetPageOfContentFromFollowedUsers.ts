import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostFromFollowedUsersResponse } from "../..";

const followedUsersFeedKey = "FollowedUsers";

export const useGetPageOfContentFromFollowedUsers = () => {
  return useInfiniteQuery<
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    Error,
    SuccessfulGetPageOfPostFromFollowedUsersResponse,
    string[]
  >(
    [CacheKeys.ContentFeed, followedUsersFeedKey],
    ({ pageParam }) => fetchPageOfContentFromFromFollowedUsers({ pageParam }),
    {
      getPreviousPageParam: (lastPage) => lastPage.previousPageCursor,
    },
  );
};

async function fetchPageOfContentFromFromFollowedUsers({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfPostFromFollowedUsers({
    cursor: pageParam,
    pageSize: 5,
  });
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}
