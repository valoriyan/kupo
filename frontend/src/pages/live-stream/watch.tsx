import Head from "next/head";
import { GetStaticProps } from "next";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { WatchLiveStream } from "#/templates/LiveStream/watch";

const WatchLiveStreamPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Watch LiveStream / Kupo</title>
      </Head>
      <WatchLiveStream />
    </>
  );
});

WatchLiveStreamPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export const getStaticProps: GetStaticProps = async () => {
  // Let's not ship this page in production until it's ready
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};

export default WatchLiveStreamPage;
