import React, { FormEventHandler, ReactNode } from "react";
import Link from "next/link";
import { Box, Flex, Stack } from "#/components/Layout";
import { styled } from "#/styling";
import { BrandTitle, MainTitle, Slogan } from "../Typography";

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
        <BrandTitle>kupono</BrandTitle>
        <Slogan css={{ mt: "$3" }}>create. support. love</Slogan>
        <MainTitle css={{ alignSelf: "flex-start", mt: "$8" }}>{props.title}</MainTitle>
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

const StyledLink = styled("a", {
  alignSelf: "flex-start",
  fontFamily: "$4",
  color: "$primary",
  textDecoration: "none",
});
