import { useGetPageOfContentFromFollowedUsers } from "#/api/queries/feed/useGetPageOfContentFromFollowedUsers";
import { Box, Stack } from "#/components/Layout";
import { Post } from "#/components/Post";
import { styled } from "#/styling";
import { ContentFeedControlBar } from "./ContentFeedControlBar";

export const Home = () => {
  const infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers = useGetPageOfContentFromFollowedUsers();
  
  const {
    data: pagesOfContentFromFrollowedUsers,
    isError: isErrorAcquiringPagesOfContentFromFrollowedUsers,
    isLoading: isLoadingPagesOfContentFromFrollowedUsers,
    error: errorAcquiringPagesOfContentFromFrollowedUsers,
  } = infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers;

  if (
    (isErrorAcquiringPagesOfContentFromFrollowedUsers && !isLoadingPagesOfContentFromFrollowedUsers)
  ) {
    return <div>Error: {(errorAcquiringPagesOfContentFromFrollowedUsers as Error).message}</div>;
  }

  if (
    isLoadingPagesOfContentFromFrollowedUsers ||
    !pagesOfContentFromFrollowedUsers
  ) {
    return <div>Loading</div>;
  }

  const posts = pagesOfContentFromFrollowedUsers.pages.flatMap((page) => {
    return page.posts;
  });

  const renderedPosts = posts.map((post) => {
    return (
      <Post
      key={post.postId}
      post={post}
      authorUserName={post.authorUserId}
      authorUserAvatar={undefined}
    />
    )
  });

  return (
    <Grid>
      <ContentFeedControlBar />
      
      <ContentItemsList>
        {renderedPosts}
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
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
