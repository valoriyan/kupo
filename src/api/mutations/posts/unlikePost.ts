import { InfiniteData, useMutation, useQueryClient } from "react-query";
import {
  Api,
  SuccessfulGetPageOfPostsPaginationResponse,
  UserContentFeedFilter,
} from "../..";
import {
  updateCurrentlyActivePostCacheForUserPosts,
  UpdateQueriedPostDataFunction,
} from "./utilities";

export const useUnlikePost = ({
  postId,
  authorUserId,
  contentFilter,
}: {
  postId: string;
  authorUserId: string;
  contentFilter?: UserContentFeedFilter;
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
        const updateQueriedPostDataFunction: UpdateQueriedPostDataFunction = (
          queriedData:
            | InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>
            | undefined,
        ) => {
          if (!!queriedData) {
            const updatedPages = queriedData.pages.map((page) => {
              const updatedRenderablePosts = page.posts.map((post) => {
                if (post.postId === postId) {
                  console.log(
                    "post.likes.count",
                    post.likes.count,
                    typeof post.likes.count,
                  );

                  return {
                    ...post,
                    isLikedByClient: false,
                    likes: {
                      count: post.likes.count - 1,
                    },
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
        };

        updateCurrentlyActivePostCacheForUserPosts({
          updateQueriedPostDataFunction,
          queryClient,
          authorUserId,
          contentFilter,
        });
      },
    },
  );
};
