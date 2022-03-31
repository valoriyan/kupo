import Image from "next/image";
import { ContentElement } from "#/api";
import { ErrorMessage } from "#/components/ErrorArea";
import { styled } from "#/styling";

export interface ContentProps {
  contentElement: ContentElement;
}

export const Content = ({ contentElement }: ContentProps) => {
  console.log(contentElement);

  if (contentElement.mimeType.includes("image")) {
    return (
      <ImageWrapper>
        <BlurredImage
          alt="Blurred Post Media"
          src={contentElement.temporaryUrl}
          layout="fill"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
        <Image
          alt="Post Media"
          src={contentElement.temporaryUrl}
          layout="fill"
          objectFit="contain"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
      </ImageWrapper>
    );
  }

  if (contentElement.mimeType.includes("video")) {
    return (
      <ImageWrapper>
        <Video src={contentElement.temporaryUrl} controls />
      </ImageWrapper>
    );
  }

  return (
    <ImageWrapper css={{ justifyContent: "center", alignItems: "center" }}>
      <ErrorMessage>Unsupported file format</ErrorMessage>
    </ImageWrapper>
  );
};

const ImageWrapper = styled("div", {
  display: "flex",
  position: "relative",
  size: "100%",
  bg: "$background3",
});

const BlurredImage = styled(Image, {
  filter: "blur(20px)",
  opacity: 0.9,
});

const Video = styled("video", {
  position: "absolute",
  size: "100%",
  objectFit: "contain",
});
