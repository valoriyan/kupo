import Head from "next/head";
import { VerifyUserEmail } from "#/templates/VerifyUserEmail";

const VerifyUserEmailPage = () => {
  return (
    <>
      <Head>
        <title>Reset Password / Kupo</title>
      </Head>
      <VerifyUserEmail />
    </>
  );
};

export default VerifyUserEmailPage;
