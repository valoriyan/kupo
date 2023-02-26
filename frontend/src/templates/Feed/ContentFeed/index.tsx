import { RenderablePost, UserContentFeedFilter, UserContentFeedFilterType } from "#/api";
import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { ErrorMessage } from "#/components/ErrorArea";
import { DEFAULT_EOL_MESSAGE, InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { goToPostPage } from "#/templates/SinglePost";
import { WelcomeMessage } from "./WelcomeMessage";

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
    return <LoadingArea size="lg" />;
  }

  const posts = data.pages.flatMap((page) => page.publishedItems);

  return posts.length === 0 ? (
    selectedContentFilter.type === UserContentFeedFilterType.FollowingUsers ? (
      <WelcomeMessage />
    ) : (
      <ErrorMessage>No Posts Found</ErrorMessage>
    )
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
