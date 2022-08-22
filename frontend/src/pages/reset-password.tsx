import Head from "next/head";
import { ResetPassword } from "#/templates/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <>
      <Head>
        <title>Reset Password / Kupo</title>
      </Head>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
