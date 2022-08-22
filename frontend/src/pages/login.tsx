import Head from "next/head";
import { RedirectAfterAuth } from "#/contexts/auth";
import { Login } from "#/templates/Login";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login / Kupo</title>
      </Head>
      <Login />
    </>
  );
};

export default RedirectAfterAuth(LoginPage);
