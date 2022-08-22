import Head from "next/head";
import { Home } from "#/templates/Home";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Kupo</title>
      </Head>
      <Home />
    </>
  );
};

export default HomePage;
