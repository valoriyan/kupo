import { PublishedItemType, RenderablePost, RenderableUser } from "#/api";
import { useGetPublishedItemsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
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
    useGetPublishedItemsByUserId({
      userId: user.userId,
      publishedItemType: PublishedItemType.Post,
    });

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

  const posts = data.pages.flatMap((page) => page.publishedItems);

  return posts.length === 0 ? (
    <ErrorMessage>No Posts Yet</ErrorMessage>
  ) : (
    <InfiniteScrollArea
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      items={posts.map((post) => (
        <Post
          key={post.id}
          post={post as unknown as RenderablePost}
          handleClickOfCommentsButton={() => goToPostPage(post.id)}
        />
      ))}
    />
  );
};
