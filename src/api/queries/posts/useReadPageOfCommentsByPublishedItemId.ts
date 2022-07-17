import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, ReadPageOfCommentsByPublishedItemIdSuccess } from "../..";

export const useReadPageOfCommentsByPublishedItemId = ({
  postId,
}: {
  postId: string;
}) => {
  return useInfiniteQuery<
    ReadPageOfCommentsByPublishedItemIdSuccess,
    Error,
    ReadPageOfCommentsByPublishedItemIdSuccess,
    string[]
  >(
    [CacheKeys.PostComments, postId],
    ({ pageParam }) => fetchPageOfCommentsByPostId({ pageParam, postId }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!postId,
    },
  );
};

async function fetchPageOfCommentsByPostId({
  postId,
  pageParam,
}: {
  postId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.readPageOfCommentsByPublishedItemId({
    postId,
    pageSize: 25,
    cursor: pageParam,
  });

  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error.reason as string);
}
