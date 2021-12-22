import Link from "next/link";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";

export const ForgotPassword = () => {
  const onSubmit = () => {};

  return (
    <AuthFormLayout title="Forgot Password" onSubmit={onSubmit}>
      <Stack css={{ gap: "$4" }}>
        <Input size="lg" placeholder="email" />
        <Button size="lg" variant="secondary">
          Reset Password
        </Button>
      </Stack>
      <Stack css={{ gap: "$4", pt: "$9" }}>
        <Link href="/sign-up" passHref>
          <Button as="a" size="lg" variant="primary">
            Sign Up
          </Button>
        </Link>
        <Link href="/login" passHref>
          <Button size="lg" variant="secondary">
            Return to Log In
          </Button>
        </Link>
      </Stack>
    </AuthFormLayout>
  );
};
