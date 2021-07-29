import Link from "next/link";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { styled } from "#/styling";

export const Login = () => {
  return (
    <AuthFormLayout title="Log into existing account">
      <Stack css={{ gap: "$4" }}>
        <Input placeholder="username" />
        <Input placeholder="password" />
        <Link href="/forgot-password" passHref>
          <StyledLink css={{ ml: "$4" }}>forgot password</StyledLink>
        </Link>
      </Stack>
      <Stack css={{ gap: "$4", pt: "$9" }}>
        <Button size="lg" variant="primary">
          Log In
        </Button>
        <Link href="/sign-up" passHref>
          <Button as="a" size="lg" variant="secondary">
            Sign Up
          </Button>
        </Link>
      </Stack>
    </AuthFormLayout>
  );
};

const StyledLink = styled("a", {
  alignSelf: "flex-start",
  fontFamily: "$4",
  color: "$primary",
  textDecoration: "none",
});
