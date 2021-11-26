import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { useLoginUser } from "#/api/mutations/users/loginUser";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { styled } from "#/styling";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: loginUser, isLoading } = useLoginUser();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    loginUser({ username, password });
  };

  return (
    <AuthFormLayout title="Log into existing account" onSubmit={onSubmit}>
      <Stack css={{ gap: "$4" }}>
        <Input
          required
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <Input
          required
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Link href="/forgot-password" passHref>
          <StyledLink css={{ ml: "$4" }}>forgot password</StyledLink>
        </Link>
      </Stack>
      <Stack css={{ gap: "$4", pt: "$9" }}>
        <Button size="lg" variant="primary" disabled={isLoading} type="submit">
          <TextOrSpinner isLoading={isLoading}>Log In</TextOrSpinner>
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
