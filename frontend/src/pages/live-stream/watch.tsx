import Head from "next/head";
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

export default WatchLiveStreamPage;
