import Image from "next/image";
import { RenderablePost, RenderableShopItem } from "#/api";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { FileDocumentIcon } from "../Icons";
import { Flex } from "../Layout";

export interface PostThumbnailProps {
  post: RenderablePost | RenderableShopItem;
}

export const PostThumbnail = ({ post }: PostThumbnailProps) => {
  const mediaElements = post.mediaElements ?? post.sharedItem.mediaElements;

  return mediaElements[0] ? (
    <ImageWrapper onClick={() => goToPostPage(post.id)}>
      <Image
        alt="Post Media"
        src={mediaElements[0].temporaryUrl}
        layout="fill"
        objectFit="cover"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
    </ImageWrapper>
  ) : (
    <Flex
      as="button"
      onClick={() => goToPostPage(post.id)}
      css={{
        justifyContent: "center",
        alignItems: "center",
        size: "$9",
        color: "$secondaryText",
      }}
    >
      <FileDocumentIcon />
    </Flex>
  );
};

const ImageWrapper = styled("button", {
  position: "relative",
  size: "$9",
  bg: "$background3",
});
