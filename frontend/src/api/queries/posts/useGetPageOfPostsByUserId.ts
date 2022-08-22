import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetPublishedItemsByUsernameSuccess, PublishedItemType } from "../..";

export interface GetPublishedItemsByUserIdArgs {
  userId: string;
  publishedItemType: PublishedItemType;
}

export const useGetPublishedItemsByUserId = ({
  userId,
  publishedItemType,
}: GetPublishedItemsByUserIdArgs) => {
  return useInfiniteQuery<
    GetPublishedItemsByUsernameSuccess,
    Error,
    GetPublishedItemsByUsernameSuccess,
    string[]
  >(
    [
      publishedItemType === PublishedItemType.Post
        ? CacheKeys.UserPostPages
        : CacheKeys.UserShopItemPages,
      userId,
    ],
    ({ pageParam }) => fetchPageOfPublishedItem({ pageParam, userId, publishedItemType }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!userId,
    },
  );
};

export async function fetchPageOfPublishedItem({
  pageParam,
  userId,
  publishedItemType,
}: {
  pageParam: string | undefined;
  userId: string;
  publishedItemType: PublishedItemType;
}) {
  const res = await Api.getPublishedItemsByUserId(
    {
      userId,
      pageSize: 25,
      cursor: pageParam,
      publishedItemType,
    },
    { authStrat: "tryToken" },
  );
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error.reason as string);
}
