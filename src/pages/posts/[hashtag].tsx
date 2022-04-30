import { useRouter } from "next/router";
import { ReactElement } from "react";
import { AppLayout } from "#/components/AppLayout";
import { PostsByHashTag } from "#/templates/PostsByHashTag";

const PostsByHashTagPage = () => {
  const router = useRouter();
  const hashtag = router.query.hashtag as string;

  return <PostsByHashTag hashTag={hashtag} />;
};

PostsByHashTagPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default PostsByHashTagPage;
