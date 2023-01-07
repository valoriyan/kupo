import { useRouter } from "next/router";
import { useEffect } from "react";
import { useVerifyUserEmail } from "#/api/mutations/users/verifyEmail";

export const VerifyUserEmail = () => {
  const router = useRouter();

  const verifyUserEmailToken = router.query.token;

  if (
    !(typeof verifyUserEmailToken === "string" || verifyUserEmailToken instanceof String)
  ) {
    return <div>Bad verifyUserEmail token</div>;
  }

  return <VerifyUserEmailInner verifyUserEmailToken={verifyUserEmailToken as string} />;
};

const VerifyUserEmailInner = ({
  verifyUserEmailToken,
}: {
  verifyUserEmailToken: string;
}) => {
  const router = useRouter();

  const {
    mutateAsync: verifyUserEmail,
    data: isTokenValid,
    isError,
  } = useVerifyUserEmail();

  useEffect(() => {
    if (!!isTokenValid || isError) {
      router.push("/feed");
    }

    verifyUserEmail({ token: verifyUserEmailToken });
  }, [verifyUserEmail, isError, isTokenValid, verifyUserEmailToken, router]);

  return <div></div>;
};
