import { RenderablePost } from "#/api";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { Post } from "#/components/Post";

export const ContentFeedPostBox = ({ post }: { post: RenderablePost }) => {
  const { isLikedByClient, postId, authorUserId } = post;

  const { mutateAsync: likePost } = useLikePost({
    postId,
  });
  const { mutateAsync: unlikePost } = useUnlikePost({
    postId,
    authorUserId,
  });

  async function handleClickOfLikeButton() {
    if (isLikedByClient) {
      unlikePost();
    } else {
      likePost();
    }
  }

  return (
    <Post
      key={post.postId}
      post={post}
      authorUserName={post.authorUserId}
      authorUserAvatar={undefined}
      handleClickOfLikeButton={handleClickOfLikeButton}
    />
  );
};
