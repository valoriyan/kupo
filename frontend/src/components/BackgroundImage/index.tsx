import { styled, css } from "#/styling";

export interface BackgroundImageProps {
  alt: string;
  src?: string;
}

export const BackgroundImage = (props: BackgroundImageProps) => {
  return props.src ? (
    <Img alt={props.alt} src={props.src} />
  ) : (
    <Fallback role="img" aria-label="BackgroundImage Fallback" />
  );
};

const baseStyles = css({
  width: "100%",
  height: "$12",
  bg: "$border",
});

const Img = styled("img", baseStyles, {
  objectFit: "cover",
});

const Fallback = styled("div", baseStyles);
