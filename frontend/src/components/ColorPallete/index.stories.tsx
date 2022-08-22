import { Story } from "@storybook/react";
import { styled } from "#/styling";
import { Flex, Stack } from "../Layout";

const primaries = {
  primary900: "#000",
  primary800: "#000",
  primary700: "#000",
  primary600: "#000",
  primary500: "#000",
  primary400: "#000",
  primary300: "#000",
  primary200: "#000",
  primary100: "#000",
};

const grays = {
  gray900: "hsla(242, 14%, 7%, 1)",
  gray800: "hsla(242, 14%, 9%, 1)",
  gray700: "hsla(242, 12%, 12%, 1)",
  gray600: "hsla(242, 12%, 16%, 1)",
  gray500: "hsla(242, 12%, 20%, 1)",
  gray400: "hsla(242, 12%, 24%, 1)",
  gray300: "hsla(242, 14%, 28%, 1)",
  gray200: "hsla(242, 14%, 32%, 1)",
  gray100: "hsla(242, 14%, 36%, 1)",
};

const whites = {
  white900: "hsla(242, 12%, 55%, 1)",
  white800: "hsla(242, 13%, 60%, 1)",
  white700: "hsla(242, 13%, 66%, 1)",
  white600: "hsla(242, 14%, 74%, 1)",
  white500: "hsla(242, 14%, 80%, 1)",
  white400: "hsla(242, 16%, 86%, 1)",
  white300: "hsla(242, 16%, 94%, 1)",
  white200: "hsla(242, 16%, 97%, 1)",
  white100: "hsla(242, 16%, 100%, 1)",
};

export const ColorPallete = () => {
  return (
    <Flex css={{ gap: "$5" }}>
      <ColorStack>
        {Object.values(primaries).map((primary) => (
          <Swatch key={primary} css={{ bg: primary }} />
        ))}
      </ColorStack>
      <ColorStack>
        {Object.values(grays).map((gray) => (
          <Swatch key={gray} css={{ bg: gray }} />
        ))}
      </ColorStack>
      <ColorStack>
        {Object.values(whites).map((white) => (
          <Swatch key={white} css={{ bg: white }} />
        ))}
      </ColorStack>
    </Flex>
  );
};

const ColorStack = styled(Stack, {
  p: "$4",
  // gap: "$4",
});

const Swatch = styled("div", {
  size: "$10",
  // borderRadius: "$3",
});

export default {
  title: "ColorPallete",
  component: ColorPallete,
};

export const Template: Story = () => <ColorPallete />;
