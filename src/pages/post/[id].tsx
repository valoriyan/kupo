import { useRouter } from "next/router";
import { SinglePost } from "#/templates/SinglePost";

const PostPage = () => {
  const router = useRouter();
  const postId = router.query.id as string;

  return <SinglePost postId={postId} />;
};

export default PostPage;
