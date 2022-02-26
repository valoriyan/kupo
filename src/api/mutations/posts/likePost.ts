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

export const useLikePost = ({
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
      return await Api.userLikesPost({
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
                  return {
                    ...post,
                    isLikedByClient: true,
                    likes: {
                      count: post.likes.count + 1,
                    },
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
