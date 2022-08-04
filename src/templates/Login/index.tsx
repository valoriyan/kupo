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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: loginUser, isLoading } = useLoginUser();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginUser({ email, password });
  };

  return (
    <AuthFormLayout title="Log into existing account" onSubmit={onSubmit}>
      <Stack css={{ gap: "$5" }}>
        <Input
          size="lg"
          required
          placeholder="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value.toLocaleLowerCase())}
        />
        <Input
          size="lg"
          required
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Link href="/forgot-password" passHref>
          <StyledLink css={{ ml: "$5" }}>forgot password</StyledLink>
        </Link>
      </Stack>
      <Stack css={{ gap: "$5", pt: "$10" }}>
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
