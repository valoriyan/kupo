import { useRouter } from "next/router";
import { ReactElement } from "react";
import { AppLayout } from "#/components/AppLayout";
import { SinglePost } from "#/templates/SinglePost";

const PostPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;

  return <SinglePost postId={postId} />;
};

PostPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default PostPage;
