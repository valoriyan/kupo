import { RenderableUser } from "#/api";
import { useGetPageOfShopItemsByUserId } from "#/api/queries/shopItems/useGetPageOfShopItemsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { goToPostPage } from "#/templates/SinglePost";

export interface UserShopItemsProps {
  user: RenderableUser;
}

export const UserShopItems = ({ user }: UserShopItemsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPageOfShopItemsByUserId({ userId: user.userId });

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

  const shopItems = data.pages
    .flatMap((page) => page.shopItems)
    .map((shopItem) => ({
      postId: shopItem.shopItemId,
      authorUserId: shopItem.authorUserId,
      caption: shopItem.description,
      creationTimestamp: shopItem.creationTimestamp,
      scheduledPublicationTimestamp: shopItem.scheduledPublicationTimestamp,
      expirationTimestamp: shopItem.expirationTimestamp,
      mediaElements: shopItem.mediaElements,
      hashtags: shopItem.hashtags,
      likes: { count: 0 },
      comments: { count: 0 },
      isLikedByClient: false,
      isSavedByClient: false,
    }));

  return (
    <InfiniteScrollArea
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      items={shopItems.map((post) => (
        <Post
          key={post.postId}
          post={post}
          handleClickOfCommentsButton={() => goToPostPage(post.postId)}
        />
      ))}
    />
  );
};
