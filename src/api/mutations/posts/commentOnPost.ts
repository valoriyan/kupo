import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfullyGotPageOfCommentsByPostIdResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useCommentOnPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, text }: { postId: string; text: string }) => {
      return await Api.commentOnPost({
        postId,
        text,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const createdPostComment = data.data.success.postComment;
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
