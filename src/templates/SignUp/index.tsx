import Link from "next/link";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";

export const SignUp = () => {
  return (
    <AuthFormLayout title="Create a new account">
      <Stack css={{ gap: "$4" }}>
        <Input placeholder="username" />
        <Input placeholder="password" />
        <Input placeholder="email" />
      </Stack>
      <Stack css={{ gap: "$4", pt: "$8" }}>
        <Button size="lg" variant="primary">
          Complete Sign Up
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
