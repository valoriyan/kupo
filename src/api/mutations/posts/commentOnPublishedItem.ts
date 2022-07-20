import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Api, ReadPageOfCommentsByPublishedItemIdSuccess } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useCommentOnPublishedItem = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ publishedItemId, text }: { publishedItemId: string; text: string }) => {
      const res = await Api.createPublishedItemComment({
        publishedItemId,
        text,
      });

      if (res.data.success) return res.data.success;
      const defaultErrorMessage = "Failed to post comment";
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
          const createdPostComment = data.postComment;
          const { publishedItemId } = createdPostComment;

          queryClient.setQueryData<
            InfiniteData<ReadPageOfCommentsByPublishedItemIdSuccess>
          >(
            [CacheKeys.PostComments, publishedItemId],
            (queriedData): InfiniteData<ReadPageOfCommentsByPublishedItemIdSuccess> => {
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page, index) => {
                  if (index < queriedData.pages.length - 1) {
                    return page;
                  }

                  const existingPostCommentIds = page.postComments.map(
                    (chatMessage) => chatMessage.publishedItemId,
                  );

                  const updatedPostComments = !existingPostCommentIds.includes(
                    createdPostComment.publishedItemId,
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
