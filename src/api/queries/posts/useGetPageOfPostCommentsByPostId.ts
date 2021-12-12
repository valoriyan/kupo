import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfullyGotPageOfCommentsByPostIdResponse } from "../..";

async function fetchPageOfCommentsByPostId({
  postId,
}: {
  postId: string;
  pageParam: string | undefined;
}) {
  const res = await Api.getPageOfCommentsByPostId({
    postId,
    pageSize: 25,
  });
  if (res.data && res.data.success) {
    return res.data.success;
  }

  throw new Error(res.data.error?.reason);
}

export const useGetPageOfPostCommentsByPostId = ({ postId }: { postId: string }) => {
  return useInfiniteQuery<
    SuccessfullyGotPageOfCommentsByPostIdResponse,
    Error,
    SuccessfullyGotPageOfCommentsByPostIdResponse,
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
