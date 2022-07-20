import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, ReadPageOfCommentsByPublishedItemIdSuccess } from "../..";

export const useReadPageOfCommentsByPublishedItemId = ({
  publishedItemId,
}: {
  publishedItemId: string;
}) => {
  return useInfiniteQuery<
    ReadPageOfCommentsByPublishedItemIdSuccess,
    Error,
    ReadPageOfCommentsByPublishedItemIdSuccess,
    string[]
  >(
    [CacheKeys.PostComments, publishedItemId],
    ({ pageParam }) => fetchPageOfCommentsByPostId({ pageParam, publishedItemId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!publishedItemId,
    },
  );
};

async function fetchPageOfCommentsByPostId({
  publishedItemId,
  pageParam,
}: {
  publishedItemId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.readPageOfCommentsByPublishedItemId({
    publishedItemId,
    pageSize: 25,
    cursor: pageParam,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error.reason as string);
}
