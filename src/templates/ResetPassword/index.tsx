import { useRouter } from "next/router";
import { FormEventHandler, useEffect } from "react";
import { useCheckResetPasswordTokenValidity } from "#/api/mutations/users/checkResetPasswordTokenValidity";
import { AuthFormLayout } from "#/components/AuthFormLayout";

export const ResetPassword = () => {
  const router = useRouter();

  const resetPasswordToken = router.query.token;

  if (!(typeof resetPasswordToken === "string" || resetPasswordToken instanceof String)) {
    return <div>Bad reset passwork token</div>;
  }

  return <ResetPasswordInner resetPasswordToken={resetPasswordToken as string} />;
};

const ResetPasswordInner = ({ resetPasswordToken }: { resetPasswordToken: string }) => {
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
  };

  return (
    <AuthFormLayout title="Reset Password" onSubmit={onSubmit}>
      <div>Reset Password Here</div>
    </AuthFormLayout>
  );
};
