import { useGetPageOfContentFeed } from "#/api/queries/feed/useGetPageOfContentFeed";
import { Box, Stack } from "#/components/Layout";
import { styled } from "#/styling";
import {
  ContentFeedFilter,
  ContentFeedStateProvider,
  useContentFeedState,
} from "./ContentFeedContext";
import { ContentFeedControlBar } from "./ContentFeedControlBar";
import { ContentFeedPostBox } from "./ContentFeedPostBox";

export const HomeDoubleInner = ({
  selectedContentFilter,
}: {
  selectedContentFilter: ContentFeedFilter;
}) => {
  const infiniteQueryResultOfFetchingPageOfContentFromFollowedUsers =
    useGetPageOfContentFeed({ contentFeedFilter: selectedContentFilter });

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
    return <ContentFeedPostBox key={post.postId} post={post} />;
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

export const HomeInner = () => {
  const { selectedContentFilter } = useContentFeedState();

  return <HomeDoubleInner selectedContentFilter={selectedContentFilter} />;
};

const Grid = styled("div", {
  display: "grid",
  gridTemplateRows: "5% 95%",
  height: "100%",
  width: "100%",
});

const PlaceholderItem = () => {
  return <Box css={{ width: "100%", minHeight: "$15", bg: "$background3" }} />;
};

const ContentItemsList = styled(Stack, {
  height: "100%",
  overflow: "auto",
  gap: "$5",
  p: "$5",
  "> *:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});

export const Home = () => {
  return (
    <ContentFeedStateProvider>
      <HomeInner />
    </ContentFeedStateProvider>
  );
};
