import { UserContentFeedFilter } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Flex } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { goToPostPage } from "#/templates/SinglePost";

export interface ContentFeedProps {
  selectedContentFilter: UserContentFeedFilter;
}

export const ContentFeed = ({ selectedContentFilter }: ContentFeedProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPageOfContentFeed({
      filterType: selectedContentFilter.type,
      filterValue: selectedContentFilter.value,
    });

  if (!!error && !isLoading) {
    return <ErrorMessage>{error?.message ?? "An error occurred"}</ErrorMessage>;
  }

  if (isLoading || !data) {
    return (
      <Flex css={{ p: "$6" }}>
        <LoadingArea size="lg" />
      </Flex>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts);

  return posts.length === 0 ? (
    <ErrorMessage>No Posts Found</ErrorMessage>
  ) : (
    <InfiniteScrollArea
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      items={posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          handleClickOfCommentsButton={() => goToPostPage(post.id)}
        />
      ))}
    />
  );
};
