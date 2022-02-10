import Image from "next/image";
import { styled } from "#/styling";

export interface ContentProps {
  contentUrl: string;
}

export const Content = (props: ContentProps) => {
  return (
    <ImageWrapper>
      <BlurredImage
        alt="Blurred Post Media"
        src={props.contentUrl}
        layout="fill"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
      <Image
        alt="Post Media"
        src={props.contentUrl}
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
