import Head from "next/head";
import ResetPassword from "./reset-password";

const VerifyUserEmailPage = () => {
  return (
    <>
      <Head>
        <title>Reset Password / Kupo</title>
      </Head>
      <ResetPassword />
    </>
  );
};

export default VerifyUserEmailPage;
