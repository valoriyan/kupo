import { styled, css, ThemeScale } from "#/styling";
import { User } from "../Icons";

export interface AvatarProps {
  alt: string;
  src?: string;
  size?: ThemeScale<"sizes">;
}

export const Avatar = (props: AvatarProps) => {
  return props.src ? (
    <Img alt={props.alt} src={props.src} css={{ size: props.size }} />
  ) : (
    <Fallback role="img" aria-label="Avatar Fallback Icon" css={{ size: props.size }}>
      <FallBackIcon />
    </Fallback>
  );
};

const baseStyles = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  size: "$9",
  borderRadius: "$round",
  bg: "$border",
  color: "$inverseText",
});

const Img = styled("img", baseStyles, {
  objectFit: "cover",
});

const Fallback = styled("div", baseStyles);

const FallBackIcon = styled(User, { minHeight: "50%", minWidth: "50%" });
