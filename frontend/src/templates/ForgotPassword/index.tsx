import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { useRequestAPasswordResetEmail } from "#/api/mutations/users/requestAPasswordResetEmail";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { mutateAsync: requestAPasswordResetEmail } = useRequestAPasswordResetEmail();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestAPasswordResetEmail({ email });
  };

  const onChangeEmail = async (event: ChangeEvent<HTMLInputElement>) => {
    const updatedEmail = event.currentTarget.value;
    setEmail(updatedEmail);
  };

  return (
    <AuthFormLayout title="Forgot Password" onSubmit={onSubmit}>
      <Stack css={{ gap: "$5" }}>
        <Input size="lg" label="Email" onChange={onChangeEmail} />
        <Button size="lg" variant="primary">
          Reset Password
        </Button>
      </Stack>
      <Stack css={{ gap: "$5", pt: "$10" }}>
        <Link href="/login" passHref>
          <Button size="lg" variant="secondary">
            Return to Log In
          </Button>
        </Link>
        <Link href="/sign-up" passHref>
          <Button as="a" size="lg" variant="secondary" outlined>
            Sign Up
          </Button>
        </Link>
      </Stack>
    </AuthFormLayout>
  );
};
