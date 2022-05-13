import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";
import { useCheckResetPasswordTokenValidity } from "#/api/mutations/users/checkResetPasswordTokenValidity";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { Stack } from "#/components/Layout";
import { Input } from "#/components/Input";
import { Button } from "#/components/Button";
import { useResetPassword } from "#/api/mutations/users/resetPassword";
import { TextOrSpinner } from "#/components/TextOrSpinner";

export const ResetPassword = () => {
  const router = useRouter();

  const resetPasswordToken = router.query.token;

  if (!(typeof resetPasswordToken === "string" || resetPasswordToken instanceof String)) {
    return <div>Bad reset passwork token</div>;
  }

  return <ResetPasswordInner resetPasswordToken={resetPasswordToken as string} />;
};

const ResetPasswordInner = ({ resetPasswordToken }: { resetPasswordToken: string }) => {
  const [password, setPassword] = useState("");

  const { mutateAsync: resetPassword, isLoading } = useResetPassword();

  const {
    mutateAsync: checkResetPasswordTokenValidity,
    data: isTokenValid,
    isError,
  } = useCheckResetPasswordTokenValidity({
    token: resetPasswordToken as string,
  });

  useEffect(() => {
    if (!!isTokenValid || isError) return;

    checkResetPasswordTokenValidity();
  }, [checkResetPasswordTokenValidity, isError, isTokenValid, resetPasswordToken]);

  console.log(`isTokenValid: ${isTokenValid}`);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("CALLING", password);
    resetPassword({ password, token: resetPasswordToken });
  };

  return (
    <AuthFormLayout title="Reset Password" onSubmit={onSubmit}>
      <Stack css={{ gap: "$5" }}>
        <Input
          size="lg"
          required
          type="password"
          placeholder="new password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </Stack>
      <Stack css={{ gap: "$5", pt: "$10" }}>
        <Button size="lg" variant="primary" disabled={isLoading} type="submit">
          <TextOrSpinner isLoading={isLoading}>Reset Password</TextOrSpinner>
        </Button>
      </Stack>
    </AuthFormLayout>
  );
};
