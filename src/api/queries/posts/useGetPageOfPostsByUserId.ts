import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPostsByUsernameSuccess } from "../..";

export interface GetPostsByUserIdArgs {
  userId: string;
}

export async function fetchPageOfPostsByUserId({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPostsByUserId(
    {
      userId,
      pageSize: 25,
      cursor: pageParam,
    },
    { authStrat: "tryToken" },
  );
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}

export const useGetPageOfPostsByUserId = ({ userId }: GetPostsByUserIdArgs) => {
  return useInfiniteQuery<
    GetPostsByUsernameSuccess,
    Error,
    GetPostsByUsernameSuccess,
    string[]
  >(
    [CacheKeys.UserPostPages, userId],
    ({ pageParam }) => fetchPageOfPostsByUserId({ pageParam, userId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!userId,
    },
  );
};
