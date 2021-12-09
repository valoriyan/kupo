import { RenderablePost } from "#/api";
import { useLikePost } from "#/api/mutations/posts/likePost";
import { useUnlikePost } from "#/api/mutations/posts/unlikePost";
import { useGetPageOfContentFromFollowedUsers } from "#/api/queries/feed/useGetPageOfContentFromFollowedUsers";
import { Box, Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { styled } from "#/styling";
import { ContentFeedControlBar } from "./ContentFeedControlBar";

const PostWrapper = ({ post }: { post: RenderablePost }) => {
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

export const Home = () => {
  const infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers =
    useGetPageOfContentFromFollowedUsers();

  const {
    data: pagesOfContentFromFrollowedUsers,
    isError: isErrorAcquiringPagesOfContentFromFrollowedUsers,
    isLoading: isLoadingPagesOfContentFromFrollowedUsers,
    error: errorAcquiringPagesOfContentFromFrollowedUsers,
  } = infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers;

  if (
    isErrorAcquiringPagesOfContentFromFrollowedUsers &&
    !isLoadingPagesOfContentFromFrollowedUsers
  ) {
    return (
      <div>
        Error: {(errorAcquiringPagesOfContentFromFrollowedUsers as Error).message}
      </div>
    );
  }

  if (isLoadingPagesOfContentFromFrollowedUsers || !pagesOfContentFromFrollowedUsers) {
    return <div>Loading</div>;
  }

  const posts = pagesOfContentFromFrollowedUsers.pages.flatMap((page) => {
    return page.posts;
  });

  const renderedPosts = posts.map((post) => {
    return <PostWrapper key={post.postId} post={post} />;
  });

  const placeholders =
    renderedPosts.length === 0 ? (
      <>
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
      </>
    ) : null;

  return (
    <Grid>
      <ContentFeedControlBar />

      <ContentItemsList>
        {renderedPosts}
        {placeholders}
      </ContentItemsList>
    </Grid>
  );
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "5% 95%",
  height: "100%",
  width: "100%",
});

const PlaceholderItem = () => {
  return <Box css={{ width: "100%", minHeight: "$14", bg: "$background3" }} />;
};

const ContentItemsList = styled(Stack, {
  height: "100%",
  overflow: "auto",
  gap: "$4",
  p: "$4",
  "> *:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});
