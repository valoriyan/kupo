import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, SuccessfullyGotPageOfCommentsByPostIdResponse } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useCommentOnPost = ({
  postCommentId,
  postId,
}: {
  postCommentId: string;
  postId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.deleteCommentFromPost({
        postCommentId,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
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
