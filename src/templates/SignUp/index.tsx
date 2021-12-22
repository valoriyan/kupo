import Link from "next/link";
import React, { FormEventHandler, useState } from "react";
import { useRegisterUser } from "#/api/mutations/users/registerUser";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { mutateAsync: registerUser, isLoading } = useRegisterUser();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!username || !password || !email) return;
    registerUser({ username, password, email });
  };

  return (
    <AuthFormLayout title="Create a new account" onSubmit={onSubmit}>
      <Stack css={{ gap: "$4" }}>
        <Input
          size="lg"
          required
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <Input
          size="lg"
          required
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Input
          size="lg"
          required
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </Stack>
      <Stack css={{ gap: "$4", pt: "$8" }}>
        <Button size="lg" variant="primary" disabled={isLoading} type="submit">
          <TextOrSpinner isLoading={isLoading}>Complete Sign Up</TextOrSpinner>
        </Button>
        <Link href="/login" passHref>
          <Button as="a" size="lg" variant="secondary">
            Return to Log In
          </Button>
        </Link>
      </Stack>
    </AuthFormLayout>
  );
};
