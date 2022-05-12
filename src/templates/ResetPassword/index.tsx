import { useCheckResetPasswordTokenValidity } from "#/api/mutations/users/checkResetPasswordTokenValidity";
import { AuthFormLayout } from "#/components/AuthFormLayout";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect } from "react";

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
  }, [resetPasswordToken]);

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

export const ResetPassword = () => {
  const router = useRouter();

  const resetPasswordToken = router.query.token;

  if (!(typeof resetPasswordToken === "string" || resetPasswordToken instanceof String)) {
    return <div>Bad reset passwork token</div>;
  }

  return <ResetPasswordInner resetPasswordToken={resetPasswordToken as string} />;
};
