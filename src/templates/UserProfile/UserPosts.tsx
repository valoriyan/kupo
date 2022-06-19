import { RenderableUser } from "#/api";
import { useGetPageOfPostsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { goToPostPage } from "#/templates/SinglePost";

export interface UserPostsProps {
  user: RenderableUser;
}

export const UserPosts = ({ user }: UserPostsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPageOfPostsByUserId({ userId: user.userId });

  if (error && !isLoading) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Stack css={{ pt: "$10" }}>
        <Spinner size="lg" />
      </Stack>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  return posts.length === 0 ? (
    <ErrorMessage>No Posts Yet</ErrorMessage>
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
  );
};
