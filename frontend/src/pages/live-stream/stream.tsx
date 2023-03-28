import Head from "next/head";
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

export default StreamLiveStreamPage;
