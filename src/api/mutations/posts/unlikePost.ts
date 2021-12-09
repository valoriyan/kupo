import { InfiniteData, QueryKey, useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostsPaginationResponse } from "../..";

export const useUnlikePost = ({
  postId,
  authorUserId,
}: {
  postId: string;
  authorUserId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.removeUserLikeFromPost({
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
              if (!!queriedData) {
                const updatedPages = queriedData.pages.map((page) => {
                  const updatedRenderablePosts = page.posts.map((post) => {
                    if (post.postId === postId) {
                      return {
                        ...post,
                        isLikedByClient: false,
                      };
                    }
                    return post;
                  });

                  return {
                    ...page,
                    posts: updatedRenderablePosts,
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

        updateCache([CacheKeys.ContentFeed]);
        updateCache([CacheKeys.UserPostPages, authorUserId]);
      },
    },
  );
};
