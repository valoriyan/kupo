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

export const useDeletePost = ({
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
      return await Api.deletePost({
        postId,
      });
    },
    {
      onSuccess: () => {
        const updatePostCacheForDeleteOperation: UpdateQueriedPostDataFunction = (
          queriedData:
            | InfiniteData<SuccessfulGetPageOfPostsPaginationResponse>
            | undefined,
        ) => {
          console.log("queriedData", queriedData);
          if (!!queriedData) {
            const updatedPages = queriedData.pages.map((page) => {
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
        };

        updateCurrentlyActivePostCacheForUserPosts({
          updateQueriedPostDataFunction: updatePostCacheForDeleteOperation,
          queryClient,
          authorUserId,
          contentFilter,
        });
      },
    },
  );
};
