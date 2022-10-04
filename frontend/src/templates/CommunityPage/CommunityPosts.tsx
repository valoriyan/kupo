import { PublishedItemType, RenderablePost } from "#/api";
import { useGetPublishedItemsInPublishingChannel } from "#/api/queries/community/useGetPublishedItemsInPublishingChannel";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
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
