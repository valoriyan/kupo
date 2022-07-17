import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetShopItemsByUsernameSuccess } from "../..";

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
  const res = await Api.getShopItemsByUserId(
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
    GetShopItemsByUsernameSuccess,
    Error,
    GetShopItemsByUsernameSuccess,
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
