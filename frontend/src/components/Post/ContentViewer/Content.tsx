import Image from "next/image";
import { MediaElement } from "#/api";
import { ErrorMessage } from "#/components/ErrorArea";
import { styled } from "#/styling";
import { VideoContentViewer } from "./VideoContentViewer";

export interface ContentProps {
  mediaElement: MediaElement;
}

export const Content = ({ mediaElement }: ContentProps) => {
  if (mediaElement.mimeType.includes("image")) {
    return (
      <ImageWrapper>
        <BlurredImage
          alt="Blurred Post Media"
          src={mediaElement.temporaryUrl}
          layout="fill"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
        <Image
          alt="Post Media"
          src={mediaElement.temporaryUrl}
          layout="fill"
          objectFit="contain"
          unoptimized // Optimization caching is broken because signed urls aren't stable
          priority
        />
      </ImageWrapper>
    );
  }

  if (mediaElement.mimeType.includes("video")) {
    return (
      <ImageWrapper>
        <VideoContentViewer mediaElement={mediaElement} />
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
