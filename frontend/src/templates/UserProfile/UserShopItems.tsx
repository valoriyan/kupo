import { PublishedItemType, RenderableUser } from "#/api";
import { useGetPublishedItemsByUserId } from "#/api/queries/posts/useGetPageOfPostsByUserId";
import { ErrorMessage } from "#/components/ErrorArea";
import { DEFAULT_EOL_MESSAGE, InfiniteList } from "#/components/InfiniteList";
import { Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { Spinner } from "#/components/Spinner";
import { goToPostPage } from "#/templates/SinglePost";

export interface UserShopItemsProps {
  user: RenderableUser;
}

export const UserShopItems = ({ user }: UserShopItemsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPublishedItemsByUserId({
      userId: user.userId,
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
    <InfiniteList
      data={shopItems}
      renderItem={(index, shopItem) => (
        <Post
          key={shopItem.id}
          post={shopItem}
          handleClickOfCommentsButton={() => goToPostPage(shopItem.id)}
        />
      )}
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      endOfListMessage={DEFAULT_EOL_MESSAGE}
    />
  );
};
