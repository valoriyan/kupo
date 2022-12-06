import { PublishedItemType, RenderablePost, RenderableUser } from "#/api";
import { useGetPublishedItemsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { DEFAULT_EOL_MESSAGE, InfiniteList } from "#/components/InfiniteList";
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
    return (
      <ErrorMessage>
        {error.data.error.reason ?? "An unknown error occurred"}
      </ErrorMessage>
    );
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
    <InfiniteList
      data={posts as unknown as RenderablePost[]}
      renderItem={(index, post) => (
        <Post
          key={post.id}
          post={post}
          handleClickOfCommentsButton={() => goToPostPage(post.id)}
        />
      )}
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      endOfListMessage={DEFAULT_EOL_MESSAGE}
    />
  );
};
