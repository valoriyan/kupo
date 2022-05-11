import Image from "next/image";
import { RenderablePost } from "#/api";
import { styled } from "#/styling";
import { goToPostPage } from "#/templates/SinglePost";
import { FileDocumentIcon } from "../Icons";
import { Flex } from "../Layout";

export interface PostThumbnailProps {
  post: RenderablePost;
}

export const PostThumbnail = ({ post }: PostThumbnailProps) => {
  return post.mediaElements[0] ? (
    <ImageWrapper onClick={() => goToPostPage(post.postId)}>
      <Image
        alt="Post Media"
        src={post.mediaElements[0].temporaryUrl}
        layout="fill"
        objectFit="cover"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
    </ImageWrapper>
  ) : (
    <Flex
      as="button"
      onClick={() => goToPostPage(post.postId)}
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
