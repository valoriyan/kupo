import { InfiniteData, QueryKey, useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostsPaginationResponse } from "../..";
import { ContentFilter } from "#/api/queries/feed/useGetContentFilters";

export const useDeletePost = ({
  postId,
  authorUserId,
  contentFilter,
}: {
  postId: string;
  authorUserId: string;
  contentFilter?: ContentFilter;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.deletePost({
        postId,
      });
    },
    {
      onSuccess: () => {
        function updateCache(queryKey: QueryKey) {
          queryClient.setQueryData<
            InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>
          >(
            queryKey,
            (queriedData): InfiniteData<SuccessfulGetPageOfPostsPaginationResponse> => {
              console.log("queriedData", queriedData);
              console.log("queryKey", queryKey);
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page) => {
                  console.log("page");
                  console.log(page);
                  const updatedRenderablePosts = page.posts.filter(
                    (post) => post.postId !== postId,
                  );

                  const updatedPage: SuccessfulGetPageOfPostsPaginationResponse = {
                    ...page,
                    posts: updatedRenderablePosts,
                  };
                  return updatedPage;
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

        updateCache([CacheKeys.ContentFeed, contentFilter?.type, contentFilter?.value]);
        updateCache([CacheKeys.UserPostPages, authorUserId]);
      },
    },
  );
};
