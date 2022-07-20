import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPublishedItemsByUsernameSuccess } from "../..";

export interface GetShopItemsByUserIdArgs {
  userId: string;
}

export async function fetchPageOfShopItemsByUserId({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPublishedItemsByUserId(
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

  throw new Error(res.data.error.reason as string);
}

export const useGetPageOfShopItemsByUserId = ({ userId }: GetShopItemsByUserIdArgs) => {
  return useInfiniteQuery<
    GetPublishedItemsByUsernameSuccess,
    Error,
    GetPublishedItemsByUsernameSuccess,
    string[]
  >(
    [CacheKeys.UserShopItemPages, userId],
    ({ pageParam }) => fetchPageOfShopItemsByUserId({ pageParam, userId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!userId,
    },
  );
};
