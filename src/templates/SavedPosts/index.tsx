import { useGetSavedPosts } from "#/api/queries/posts/useGetSavedPosts";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { goToPostPage } from "../SinglePost";

export const SavedPosts = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSavedPosts();

  const posts = data?.pages.flatMap((page) => page.posts);

  return (
    <Wrapper>
      <Header>
        <MainTitle as="h1">Saved Posts</MainTitle>
      </Header>
      <div>
        {error && !isLoading ? (
          <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
        ) : isLoading || !posts ? (
          <LoadingArea size="lg" />
        ) : !posts.length ? (
          <ErrorMessage>You&apos;re all caught up!</ErrorMessage>
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
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
});

const Header = styled("div", {
  display: "flex",
  px: "$6",
  py: "$5",
  gap: "$5",
  borderBottom: "solid $borderWidths$1 $text",
});
