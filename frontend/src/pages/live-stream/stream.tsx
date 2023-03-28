import Head from "next/head";
import { GetStaticProps } from "next";
import { AppLayout } from "#/components/AppLayout";
import { ProtectedPage } from "#/contexts/auth";
import { StreamLiveStream } from "#/templates/LiveStream/stream";

const StreamLiveStreamPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Stream Live / Kupo</title>
      </Head>
      <StreamLiveStream />
    </>
  );
});

StreamLiveStreamPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export const getStaticProps: GetStaticProps = async () => {
  // Let's not ship this page in production until it's ready
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};

export default StreamLiveStreamPage;
