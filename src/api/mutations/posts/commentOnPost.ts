import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfullyGotPageOfCommentsByPostIdResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useCommentOnPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, text }: { postId: string; text: string }) => {
      const res = await Api.commentOnPost({
        postId,
        text,
      });

      if (res.data.success) return res.data.success;
      const defaultErrorMessage = "Failed to post comment";
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
          const createdPostComment = data.postComment;
          const { postId } = createdPostComment;

          queryClient.setQueryData<
            InfiniteData<SuccessfullyGotPageOfCommentsByPostIdResponse>
          >(
            [CacheKeys.PostComments, postId],
            (
              queriedData,
            ): InfiniteData<SuccessfullyGotPageOfCommentsByPostIdResponse> => {
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page, index) => {
                  if (index < queriedData.pages.length - 1) {
                    return page;
                  }

                  const existingPostCommentIds = page.postComments.map(
                    (chatMessage) => chatMessage.postCommentId,
                  );

                  const updatedPostComments = !existingPostCommentIds.includes(
                    createdPostComment.postCommentId,
                  )
                    ? [...page.postComments, createdPostComment]
                    : page.postComments;

                  return {
                    ...page,
                    postComments: updatedPostComments,
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
