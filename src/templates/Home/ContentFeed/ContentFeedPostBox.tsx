import { RenderablePost } from "#/api";
import { useCommentOnPost } from "#/api/mutations/posts/commentOnPost";
import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetPageOfPostCommentsByPostId } from "#/api/queries/posts/useGetPageOfPostCommentsByPostId";
import { useGetUserByUserId } from "#/api/queries/users/useGetUserByUserId";
import { HeartIcon } from "#/components/Icons";
import { Post } from "#/components/Post";
import { getRelativeTimestamp } from "#/utils/getRelativeTimestamp";

export const ContentFeedPostBox = ({ post }: { post: RenderablePost }) => {
  const { isLikedByClient, postId, authorUserId, creationTimestamp } = post;
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useGetUserByUserId({ userId: authorUserId });

  const {
    data: pagesOfPostComments,
    isLoading: isLoadingPostComment,
    // error: errorLoadingPostComment,
    isError: isErrorLoadingPostComment,
  } = useGetPageOfPostCommentsByPostId({ postId });

  const { mutateAsync: likePost } = useLikePost({
    postId,
    authorUserId,
  });
  const { mutateAsync: unlikePost } = useUnlikePost({
    postId,
    authorUserId,
  });
  const { mutateAsync: deletePost } = useDeletePost({
    postId,
    authorUserId,
  });
  const { mutateAsync: commentOnPost } = useCommentOnPost();

  if ((isError && !isLoading) || (isErrorLoadingPostComment && !isLoadingPostComment)) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !user || isLoadingPostComment || !pagesOfPostComments) {
    return <div>Loading</div>;
  }

  const postComments = pagesOfPostComments.pages.flatMap((page) => page.postComments);

  async function handleClickOfLikeButton() {
    if (isLikedByClient) {
      unlikePost();
    } else {
      likePost();
    }
  }

  const firstMenuOption = {
    Icon: HeartIcon,
    label: "Delete Post",
    onClick: () => {
      deletePost();
    },
  };

  const secondMenuOption = {
    Icon: HeartIcon,
    label: "Post I Like This",
    onClick: () => {
      commentOnPost({
        text: "Oooh, I like this!",
        postId,
      });
      // deletePost();
    },
  };

  return (
    <Post
      key={postId}
      postRelativeTimestamp={getRelativeTimestamp(creationTimestamp)}
      post={post}
      authorUserName={user.username}
      authorUserAvatar={user.profilePictureTemporaryUrl}
      handleClickOfLikeButton={handleClickOfLikeButton}
      menuOptions={[firstMenuOption, secondMenuOption]}
      postComments={postComments}
    />
  );
};
