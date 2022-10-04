import { PublishedItemType } from "#/api";
import { useGetPublishedItemsInPublishingChannel } from "#/api/queries/community/useGetPublishedItemsInPublishingChannel";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { goToPostPage } from "#/templates/SinglePost";

export interface CommunityShopItemsProps {
  communityName: string;
}

export const CommunityShopItems = ({ communityName }: CommunityShopItemsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPublishedItemsInPublishingChannel({
      publishingChannelName: communityName,
      publishedItemType: PublishedItemType.ShopItem,
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

  const shopItems = data.pages.flatMap((page) => page.publishedItems);

  return shopItems.length === 0 ? (
    <ErrorMessage>No Shop Items Yet</ErrorMessage>
  ) : (
    <InfiniteScrollArea
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      items={shopItems.map((shopItem) => (
        <Post
          key={shopItem.id}
          post={shopItem}
          handleClickOfCommentsButton={() => goToPostPage(shopItem.id)}
        />
      ))}
    />
  );
};
