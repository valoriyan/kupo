import { RenderablePost } from "#/api";
import { useGetSavedPosts } from "#/api/queries/posts/useGetSavedPosts";
import { DetailLayout } from "#/components/DetailLayout";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { goToPostPage } from "../SinglePost";

export const SavedPosts = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSavedPosts();

  const posts = data?.pages.flatMap((page) => page.publishedItems);

  return (
    <DetailLayout heading="Saved Posts">
      {error && !isLoading ? (
        <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
      ) : isLoading || !posts ? (
        <LoadingArea size="lg" />
      ) : !posts.length ? (
        <ErrorMessage>You haven&apos;t saved any posts yet</ErrorMessage>
      ) : (
        <InfiniteList
          hasNextPage={hasNextPage ?? false}
          isNextPageLoading={isFetchingNextPage}
          loadNextPage={fetchNextPage}
          data={posts as unknown as RenderablePost[]}
          renderItem={(index, post) => (
            <Post
              key={post.id}
              post={post}
              handleClickOfCommentsButton={() => goToPostPage(post.id)}
            />
          )}
        />
      )}
    </DetailLayout>
  );
};
