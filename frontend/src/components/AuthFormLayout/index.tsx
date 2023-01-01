import Link from "next/link";
import { FormEventHandler, ReactNode } from "react";
import { Box, Flex, Stack } from "#/components/Layout";
import { styled } from "#/styling";
import { BrandWithSlogan } from "../BrandWithSlogan";
import { MainTitle } from "../Typography";

export interface AuthFormLayoutProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export const AuthFormLayout = (props: AuthFormLayoutProps) => {
  return (
    <Flex
      css={{ justifyContent: "center", minHeight: "100vh" }}
      as="form"
      onSubmit={props.onSubmit}
    >
      <Stack
        css={{
          mt: "$10",
          mx: "$7",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <BrandWithSlogan />
        <MainTitle css={{ alignSelf: "flex-start", mt: "$9" }}>{props.title}</MainTitle>
        <Box css={{ mt: "$6", mb: "$10", width: "100%" }}>{props.children}</Box>
        <Flex css={{ gap: "$6", pb: "$6", alignSelf: "flex-start" }}>
          <Link href="/faq" passHref>
            <StyledLink>FAQ</StyledLink>
          </Link>
          <Link href="/support" passHref>
            <StyledLink>Support</StyledLink>
          </Link>
        </Flex>
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
