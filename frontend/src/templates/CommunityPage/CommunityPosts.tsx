import { PublishedItemType, RenderablePost } from "#/api";
import { useGetPublishedItemsInPublishingChannel } from "#/api/queries/community/useGetPublishedItemsInPublishingChannel";
import { ErrorMessage } from "#/components/ErrorArea";
import { DEFAULT_EOL_MESSAGE, InfiniteList } from "#/components/InfiniteList";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { goToPostPage } from "#/templates/SinglePost";

export interface CommunityPostsProps {
  communityName: string;
}

export const CommunityPosts = ({ communityName }: CommunityPostsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPublishedItemsInPublishingChannel({
      publishingChannelName: communityName,
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
