import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPageOfUsersFollowingUserIdSuccess } from "../..";

export const useGetFollowerUsers = ({ userId = "" }: { userId: string | undefined }) => {
  return useInfiniteQuery<
    GetPageOfUsersFollowingUserIdSuccess,
    Error,
    GetPageOfUsersFollowingUserIdSuccess,
    string[]
  >(
    [CacheKeys.FollowerUsers, userId],
    ({ pageParam }) => fetchPageOfFollowerUsers({ pageParam, userId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!userId,
    },
  );
};

async function fetchPageOfFollowerUsers({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfUsersFollowingUserId({
    userIdBeingFollowed: userId,
    pageSize: 25,
    cursor: pageParam,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}
