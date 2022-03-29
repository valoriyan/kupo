import Image from "next/image";
import { styled } from "#/styling";
import { ContentElement } from "#/api";

export interface ContentProps {
  contentElement: ContentElement;
}

export const Content = (props: ContentProps) => {
  return (
    <ImageWrapper>
      <BlurredImage
        alt="Blurred Post Media"
        src={props.contentElement.temporaryUrl}
        layout="fill"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
      <Image
        alt="Post Media"
        src={props.contentElement.temporaryUrl}
        layout="fill"
        objectFit="contain"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
    </ImageWrapper>
  );
};

const ImageWrapper = styled("div", {
  position: "relative",
  size: "100%",
  bg: "$background3",
});

const BlurredImage = styled(Image, {
  filter: "blur(20px)",
  opacity: 0.9,
});
