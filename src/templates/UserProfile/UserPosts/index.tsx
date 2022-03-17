import { RenderableUser } from "#/api";
import { useGetPageOfPostsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { ScrollArea } from "#/components/ScrollArea";
import { Spinner } from "#/components/Spinner";
import { styled } from "#/styling";
import { PostWrapper } from "#/templates/Feed/ContentFeed/PostWrapper";
import { goToPostPage } from "#/utils/generateLinkUrls";

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

  const posts = data.pages.flatMap((page) => {
    return page.posts;
  });

  return (
    <Wrapper>
      <InfiniteScrollArea
        hasNextPage={hasNextPage ?? false}
        isNextPageLoading={isFetchingNextPage}
        loadNextPage={fetchNextPage}
        items={posts.map((post) => (
          <PostWrapper
            key={post.postId}
            post={post}
            handleClickOfCommentsButton={() => goToPostPage(post.postId)}
          />
        ))}
      />
    </Wrapper>
  );
};

const Wrapper = styled(ScrollArea, {
  height: "100%",
  overflow: "auto",
});
