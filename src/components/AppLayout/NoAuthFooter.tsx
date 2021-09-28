import Link from "next/link";
import { styled } from "#/styling";
import { Button } from "../Button";
import { Flex, Stack } from "../Layout";
import { MainTitle } from "../Typography";

export const NoAuthFooter = () => {
  return (
    <Wrapper>
      <MainTitle>Experience the full site</MainTitle>
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
  bg: "$background1",
  px: "$6",
  py: "$4",
  gap: "$4",
  alignItems: "center",
  borderTopStyle: "solid",
  borderTopWidth: "$1",
  borderTopColor: "$border",
});
