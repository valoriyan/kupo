import Head from "next/head";
import { RedirectAfterAuth } from "#/contexts/auth";
import { ForgotPassword } from "#/templates/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <>
      <Head>
        <title>Forgot Password / Kupo</title>
      </Head>
      <ForgotPassword />
    </>
  );
};

export default RedirectAfterAuth(ForgotPasswordPage);
