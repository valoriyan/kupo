import Head from "next/head";
import { RedirectAfterAuth } from "#/contexts/auth";
import { SignUp } from "#/templates/SignUp";

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up / Kupo</title>
      </Head>
      <SignUp />
    </>
  );
};

export default RedirectAfterAuth(SignUpPage);
