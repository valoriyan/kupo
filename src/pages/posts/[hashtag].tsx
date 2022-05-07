import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { PostsByHashTag } from "#/templates/PostsByHashTag";
import { AppLayout } from "#/components/AppLayout";

const PostsByHashTagPage = () => {
  const router = useRouter();
  const hashtag = router.query.hashtag as string;

  return (
    <>
      <Head>
        <title>#{hashtag} / Kupo</title>
      </Head>
      <PostsByHashTag hashTag={hashtag} />
    </>
  );
};

PostsByHashTagPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default PostsByHashTagPage;
