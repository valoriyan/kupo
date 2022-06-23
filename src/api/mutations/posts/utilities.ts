import { InfiniteData, QueryClient } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { RenderablePost, GetPostsByUsernameSuccess } from "../..";

export const updateCachedPost = ({
  queryClient,
  authorUserId,
  postId,
  postUpdater,
}: {
  queryClient: QueryClient;
  authorUserId: string;
  postId: string;
  /** A function to update the post, or null if you want to remove the post from cache */
  postUpdater: ((oldPost: RenderablePost) => RenderablePost) | null;
}) => {
  const userPostsCacheKey = [CacheKeys.UserPostPages, authorUserId];
  const singlePostCacheKey = [CacheKeys.PostById, postId];

  const contentFeedQueries = queryClient.getQueriesData<
    InfiniteData<GetPostsByUsernameSuccess>
  >(CacheKeys.ContentFeed);
  const userPostsData =
    queryClient.getQueryData<InfiniteData<GetPostsByUsernameSuccess>>(userPostsCacheKey);
  const singlePostData = queryClient.getQueryData<RenderablePost>(singlePostCacheKey);

  for (const [queryKey, queryData] of contentFeedQueries) {
    const updatedQueryData = {
      ...queryData,
      pages: queryData.pages.map((page) => ({
        ...page,
        posts: postUpdater
          ? page.posts.map((post) => {
              if (post.id === postId) return postUpdater(post);
              return post;
            })
          : page.posts.filter((post) => post.id !== postId),
      })),
    };
    queryClient.setQueryData(queryKey, updatedQueryData);
  }

  if (userPostsData) {
    const updatedUserPostsData = {
      ...userPostsData,
      pages: userPostsData.pages.map((page) => ({
        ...page,
        posts: postUpdater
          ? page.posts.map((post) => {
              if (post.id === postId) return postUpdater(post);
              return post;
            })
          : page.posts.filter((post) => post.id !== postId),
      })),
    };
    queryClient.setQueryData(userPostsCacheKey, updatedUserPostsData);
  }

  if (!postUpdater) {
    queryClient.removeQueries(singlePostCacheKey);
  } else if (singlePostData) {
    queryClient.setQueryData(singlePostCacheKey, postUpdater(singlePostData));
  }
};

export const resetPostFeeds = ({
  queryClient,
  authorUserId,
}: {
  queryClient: QueryClient;
  authorUserId?: string;
}) => {
  queryClient.resetQueries([CacheKeys.ContentFeed]);
  if (authorUserId) {
    queryClient.resetQueries([CacheKeys.UserPostPages, authorUserId]);
  }
};
