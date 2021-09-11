import { FormEventHandler, ReactNode } from "react";
import Link from "next/link";
import { Box, Flex, Stack } from "#/components/Layout";
import { styled } from "#/styling";

export interface AuthFormLayoutProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export const AuthFormLayout = (props: AuthFormLayoutProps) => {
  return (
    <Flex css={{ justifyContent: "center" }} as="form" onSubmit={props.onSubmit}>
      <Stack
        css={{
          mt: "$9",
          mx: "$6",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Heading>scribur</Heading>
        <Slogan>create. support. love</Slogan>
        <Title>{props.title}</Title>
        <Box css={{ mt: "$5", mb: "$9", width: "100%" }}>{props.children}</Box>
        <Link href="/help-center" passHref>
          <StyledLink>Help Center</StyledLink>
        </Link>
        <Link href="/faq" passHref>
          <StyledLink css={{ mt: "$4" }}>FAQ</StyledLink>
        </Link>
      </Stack>
    </Flex>
  );
};

const Heading = styled("div", {
  fontFamily: "$heading",
  fontSize: "$7",
});

const Slogan = styled("div", {
  mt: "$3",
  color: "$primary",
  fontSize: "$4",
});

const Title = styled("div", {
  mt: "$8",
  alignSelf: "flex-start",
  fontSize: "$4",
  fontWeight: "bold",
});

const StyledLink = styled("a", {
  alignSelf: "flex-start",
  fontFamily: "$4",
  color: "$primary",
  textDecoration: "none",
});
