import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, GetSavedPublishedItemsSuccess } from "../..";

export const useGetSavedPosts = () => {
  return useInfiniteQuery<
    GetSavedPublishedItemsSuccess,
    Error,
    GetSavedPublishedItemsSuccess
  >([CacheKeys.SavedPosts], fetchPageOfSavedPosts, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageCursor;
    },
  });
};

async function fetchPageOfSavedPosts({ pageParam = undefined }) {
  const res = await Api.getSavedPublishedItems({ cursor: pageParam, pageSize: 25 });

  if (res.data && res.data.success) return res.data.success;
  throw new Error((res.data.error.reason as string) ?? "Failed to saved posts");
}
