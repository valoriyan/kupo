import { MouseEventHandler, useMemo } from "react";
import { ThemeScale } from "#/styling";
import { Avatar, AvatarFallback } from ".";
import { Box, Flex } from "../Layout";

export interface StackedAvatarsProps {
  images: Array<{ alt: string; src?: string }>;
  size?: ThemeScale<"sizes">;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export const StackedAvatars = (props: StackedAvatarsProps) => {
  const avatars = useMemo(
    () =>
      props.images
        .slice(0, 3)
        .map((image, i) => (
          <Avatar key={i} alt={image.alt} src={image.src} size={props.size} />
        )),
    [props.images, props.size],
  );

  if (props.images.length > 3) {
    avatars.push(
      <AvatarFallback css={{ size: props.size, fontSize: "$1", fontWeight: "bold" }}>
        +{props.images.length - 3}
      </AvatarFallback>,
    );
  }

  return (
    <Flex onClick={props.onClick} css={{ cursor: props.onClick ? "pointer" : "inherit" }}>
      {avatars.map((avatar, i) => (
        <Box
          key={i}
          css={{
            ml: i && "-$5",
            borderRadius: "$round",
            border: "solid $borderWidths$1 $background1",
          }}
        >
          {avatar}
        </Box>
      ))}
    </Flex>
  );
};
