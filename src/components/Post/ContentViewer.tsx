import Image from "next/image";
import { styled } from "#/styling";

export interface ContentViewerProps {
  contentUrls: string[];
}

export const ContentViewer = ({ contentUrls }: ContentViewerProps) => {
  const imageUrl = contentUrls[0];
  return (
    <ImageWrapper>
      <BlurredImage
        alt="Blurred Post Media"
        src={imageUrl}
        layout="fill"
        unoptimized // Optimization caching is broken because signed urls aren't stable
        priority
      />
      <Image
        alt="Post Media"
        src={imageUrl}
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
  width: "100%",
  height: "62vh",
  my: "$3",
  bg: "$background3",
});

const BlurredImage = styled(Image, {
  filter: "blur(20px)",
  opacity: 0.9,
});
