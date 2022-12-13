import {
  MediaElement,
  PublishedItemType,
  RootPurchasedShopItemDetails,
  RootRenderablePost,
  RootShopItemPreview,
} from "#/api";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { PostBody } from "./PostBody";

export interface SharedPostProps {
  post: RootRenderablePost | RootShopItemPreview | RootPurchasedShopItemDetails;
  setCurrentMediaElement?: (elem: MediaElement | undefined) => void;
  contentHeight?: string;
}

export const SharedPost = ({
  post,
  setCurrentMediaElement,
  contentHeight,
}: SharedPostProps) => {
  const { authorUserId, caption, mediaElements } = post;
  const { data: user } = useGetUserByUserId({ userId: authorUserId });
  const relativeTimestamp = getRelativeTimestamp(post.creationTimestamp);

  return (
    <Wrapper>
      <PostBody
        type={post.type as PublishedItemType}
        authorUserName={user?.username}
        authorUserAvatar={user?.profilePictureTemporaryUrl}
        relativeTimestamp={relativeTimestamp}
        caption={caption}
        title={"title" in post ? post.title : undefined}
        price={"price" in post ? post.price : undefined}
        purchasedMediaElementsMetadata={
          "purchasedMediaElementsMetadata" in post
            ? post.purchasedMediaElementsMetadata
            : undefined
        }
        purchasedMediaElements={
          "purchasedMediaElements" in post ? post.purchasedMediaElements : undefined
        }
        mediaElements={mediaElements}
        setCurrentMediaElement={setCurrentMediaElement}
        onPostClick={() => goToPostPage(post.id)}
        contentHeight={contentHeight}
      />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  m: "$3",
  mb: "0",
  overflow: "hidden",
  borderRadius: "$3",
  border: "solid $borderWidths$1 $border",
});
