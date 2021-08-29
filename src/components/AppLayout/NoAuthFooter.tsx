import Link from "next/link";
import { styled } from "#/styling";
import { Button } from "../Button";
import { Flex, Stack } from "../Layout";

export const NoAuthFooter = () => {
  return (
    <Wrapper>
      <Text>Experience the full site</Text>
      <Flex css={{ gap: "$5" }}>
        <Link href="/login" passHref>
          <Button as="a" size="lg" variant="primary">
            Log In
          </Button>
        </Link>
        <Link href="/sign-up" passHref>
          <Button as="a" size="lg" variant="secondary">
            Sign Up
          </Button>
        </Link>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  px: "$6",
  py: "$4",
  gap: "$4",
  bg: "$background1",
  alignItems: "center",
  borderTopStyle: "solid",
  borderTopWidth: "$1",
  borderTopColor: "$border",
});

const Text = styled("div", {
  color: "$text",
  fontWeight: "$bold",
  fontSize: "$3",
});
