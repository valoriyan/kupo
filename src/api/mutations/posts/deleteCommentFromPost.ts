import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfullyGotPageOfCommentsByPostIdResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useDeleteCommentFromPost = ({
  postCommentId,
  postId,
}: {
  postCommentId: string;
  postId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await Api.deleteCommentFromPost({
        postCommentId,
      });

      if (res.data.success) return res.data.success;
      const defaultErrorMessage = "Failed to delete comment";
      throw new Error(
        res.data.error
          ? "reason" in res.data.error
            ? res.data.error.reason
            : defaultErrorMessage
          : defaultErrorMessage,
      );
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData<
            InfiniteData<SuccessfullyGotPageOfCommentsByPostIdResponse>
          >(
            [CacheKeys.PostComments, postId],
            (
              queriedData,
            ): InfiniteData<SuccessfullyGotPageOfCommentsByPostIdResponse> => {
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page) => {
                  const updatedRenderablePosts = page.postComments.filter(
                    (postComment) => postComment.postCommentId !== postCommentId,
                  );

                  return {
                    ...page,
                    postComments: updatedRenderablePosts,
                  };
                });

                return {
                  pages: updatedPages,
                  pageParams: queriedData.pageParams,
                };
              }

              return {
                pages: [],
                pageParams: [],
              };
            },
          );
        }
      },
    },
  );
};
