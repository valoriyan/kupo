import { useRouter } from "next/router";
import { PostsByHashTag } from "#/templates/PostsByHashTag";

const PostsByHashTagPage = () => {
  const router = useRouter();
  const hashtag = router.query.hashtag as string;

  return <PostsByHashTag hashTag={hashtag} />;
};

export default PostsByHashTagPage;
