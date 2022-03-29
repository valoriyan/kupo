import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPageOfUsersFollowedByUserIdSuccess } from "../..";

export const useGetFollowingUsers = ({ userId = "" }: { userId: string | undefined }) => {
  return useInfiniteQuery<
    GetPageOfUsersFollowedByUserIdSuccess,
    Error,
    GetPageOfUsersFollowedByUserIdSuccess,
    string[]
  >(
    [CacheKeys.FollowingUsers, userId],
    ({ pageParam }) => fetchPageOfFollowingUsers({ pageParam, userId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!userId,
    },
  );
};

async function fetchPageOfFollowingUsers({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfUsersFollowedByUserId({
    userIdDoingFollowing: userId,
    pageSize: 25,
    cursor: pageParam,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}
