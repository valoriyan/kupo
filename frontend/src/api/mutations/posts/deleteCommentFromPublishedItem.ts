import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, ReadPageOfCommentsByPublishedItemIdSuccess } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useDeleteCommentFromPublishedItem = ({
  publishedItemCommentId,
  publishedItemId,
}: {
  publishedItemCommentId: string;
  publishedItemId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const res = await Api.deletePublishedItemComment({
        publishedItemCommentId,
      });

      if (res.data.success) return res.data.success;
      const defaultErrorMessage = "Failed to delete comment";
      throw new Error(
        res.data.error
          ? "reason" in res.data.error
            ? (res.data.error.reason as string)
            : defaultErrorMessage
          : defaultErrorMessage,
      );
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData<
            InfiniteData<ReadPageOfCommentsByPublishedItemIdSuccess>
          >(
            [CacheKeys.PostComments, publishedItemId],
            (queriedData): InfiniteData<ReadPageOfCommentsByPublishedItemIdSuccess> => {
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page) => {
                  const updatedRenderablePosts = page.postComments.filter(
                    (postComment) =>
                      postComment.publishedItemCommentId !== publishedItemCommentId,
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
