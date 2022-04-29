import { useGetSavedPosts } from "#/api/queries/posts/useGetSavedPosts";
import { BasicListHeader, BasicListWrapper } from "#/components/BasicList";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { goToPostPage } from "../SinglePost";

export const SavedPosts = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSavedPosts();

  const posts = data?.pages.flatMap((page) => page.posts);

  return (
    <BasicListWrapper>
      <BasicListHeader>Saved Posts</BasicListHeader>
      <div>
        {error && !isLoading ? (
          <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
        ) : isLoading || !posts ? (
          <LoadingArea size="lg" />
        ) : !posts.length ? (
          <ErrorMessage>You haven&apos;t saved any posts yet</ErrorMessage>
        ) : (
          <InfiniteScrollArea
            hasNextPage={hasNextPage ?? false}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={fetchNextPage}
            items={posts.map((post) => (
              <Post
                key={post.postId}
                post={post}
                handleClickOfCommentsButton={() => goToPostPage(post.postId)}
              />
            ))}
          />
        )}
      </div>
    </BasicListWrapper>
  );
};
