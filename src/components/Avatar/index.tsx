import { MouseEventHandler } from "react";
import { styled, css, ThemeScale } from "#/styling";
import { UserIcon } from "../Icons";

export interface AvatarProps {
  alt: string;
  src?: string;
  size?: ThemeScale<"sizes">;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export const Avatar = (props: AvatarProps) => {
  return props.src ? (
    <Img
      alt={props.alt}
      src={props.src}
      css={{ size: props.size, cursor: props.onClick ? "pointer" : "inherit" }}
      onClick={props.onClick}
    />
  ) : (
    <AvatarFallback
      role="img"
      aria-label="Avatar Fallback Icon"
      css={{ size: props.size, cursor: props.onClick ? "pointer" : "inherit" }}
      onClick={props.onClick}
    >
      <FallBackIcon />
    </AvatarFallback>
  );
};

const baseStyles = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  size: "$10",
  borderRadius: "$round",
  bg: "$border",
  color: "$inverseText",
});

const Img = styled("img", baseStyles, {
  objectFit: "cover",
});

export const AvatarFallback = styled("div", baseStyles);

const FallBackIcon = styled(UserIcon, { minHeight: "50%", minWidth: "50%" });
