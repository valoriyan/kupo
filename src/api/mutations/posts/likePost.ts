import { InfiniteData, QueryKey, useMutation, useQueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostsPaginationResponse } from "../..";

export const useLikePost = ({
  postId,
}: {
  postId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.userLikesPost({
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
                      console.log("HIT!!!");
                      return {
                        ...post,
                        isLikedByClient: true,
                      };
                    }
                    return post;
                  });

                  const updatedPages: SuccessfulGetPageOfPostsPaginationResponse = {
                    ...page,
                    posts: updatedRenderablePosts,
                  };
                  return updatedPages;
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
        // updateCache([CacheKeys.UserPostPages, authorUserId]);
      },
    },
  );
};
